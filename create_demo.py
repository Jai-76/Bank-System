"""
create_demo.py  –  Seeds the DB with a ready-to-use demo account.

Demo credentials:
  Email   : demo@nexabank.com
  Password: Demo@1234

Run with:  python create_demo.py
"""

import uuid
from datetime import datetime, timedelta
from app import app, db, User, BankAccount, Transaction, LoanApplication, generate_txn_id

DEMO_EMAIL    = "demo@nexabank.com"
DEMO_PASSWORD = "Demo@1234"
DEMO_NAME     = "Demo User"
DEMO_PHONE    = "9876543210"

with app.app_context():
    # ── 1. Remove old demo account if it exists ──────────────────────────────
    existing = User.query.filter_by(email=DEMO_EMAIL).first()
    if existing:
        # cascade-delete related records manually (SQLite doesn't enforce FKs by default)
        acc = BankAccount.query.filter_by(user_id=existing.id).first()
        if acc:
            Transaction.query.filter(
                (Transaction.sender_account_id == acc.id) |
                (Transaction.receiver_account_id == acc.id)
            ).delete()
            db.session.delete(acc)
        LoanApplication.query.filter_by(user_id=existing.id).delete()
        db.session.delete(existing)
        db.session.commit()
        print("Old demo account removed.")

    # ── 2. Create demo user ───────────────────────────────────────────────────
    user = User(full_name=DEMO_NAME, email=DEMO_EMAIL, phone=DEMO_PHONE)
    user.set_password(DEMO_PASSWORD)
    db.session.add(user)
    db.session.flush()   # get user.id

    # ── 3. Create bank account ────────────────────────────────────────────────
    account = BankAccount(
        user_id=user.id,
        account_number="100200300400",
        account_type="savings",
        balance=125000.00,
        ifsc_code="NEXA0001234",
        branch="NexaBank Digital Branch",
        is_active=True,
    )
    db.session.add(account)
    db.session.flush()   # get account.id

    # ── 4. Seed sample transactions ───────────────────────────────────────────
    sample_txns = [
        {
            "days_ago": 1,
            "direction": "credit",
            "amount": 50000.00,
            "receiver_name": "Demo User",
            "receiver_acc": "100200300400",
            "remarks": "Salary – July 2026",
        },
        {
            "days_ago": 3,
            "direction": "debit",
            "amount": 12000.00,
            "receiver_name": "Amazon India",
            "receiver_acc": "999888777666",
            "remarks": "Online Shopping",
        },
        {
            "days_ago": 5,
            "direction": "debit",
            "amount": 5500.00,
            "receiver_name": "BESCOM",
            "receiver_acc": "555444333222",
            "remarks": "Electricity Bill – June",
        },
        {
            "days_ago": 10,
            "direction": "credit",
            "amount": 8000.00,
            "receiver_name": "Demo User",
            "receiver_acc": "100200300400",
            "remarks": "Freelance Payment",
        },
        {
            "days_ago": 15,
            "direction": "debit",
            "amount": 2500.00,
            "receiver_name": "Swiggy",
            "receiver_acc": "111222333444",
            "remarks": "Food Order",
        },
    ]

    for t in sample_txns:
        txn_time = datetime.utcnow() - timedelta(days=t["days_ago"])
        txn = Transaction(
            transaction_id=generate_txn_id(),
            sender_account_id=account.id,
            receiver_account_id=None,
            receiver_account_number=t["receiver_acc"],
            receiver_name=t["receiver_name"],
            amount=t["amount"],
            transaction_type="transfer",
            remarks=t["remarks"],
            status="success",
            created_at=txn_time,
        )
        db.session.add(txn)

    # ── 5. Seed a sample approved loan ───────────────────────────────────────
    loan = LoanApplication(
        application_id="NEXA20260701DEMO01",
        user_id=user.id,
        full_name=DEMO_NAME,
        pan_number="ABCDE1234F",
        date_of_birth="1995-06-15",
        employment_type="salaried_private",
        employer_name="Tech Solutions Pvt. Ltd.",
        annual_income=720000.00,
        loan_type="personal",
        loan_amount=300000.00,
        tenure_months=36,
        purpose="Home Renovation",
        cibil_score=760,
        cibil_status="passed",
        docs_uploaded=True,
        status="approved",
        approval_score=84.0,
        interest_rate=9.0,
        monthly_emi=9535.72,
        rejection_reason=None,
        created_at=datetime.utcnow() - timedelta(days=7),
    )
    db.session.add(loan)

    db.session.commit()

    print("\n" + "="*50)
    print("  [OK] Demo account created successfully!")
    print("="*50)
    print(f"  Email    : {DEMO_EMAIL}")
    print(f"  Password : {DEMO_PASSWORD}")
    print(f"  Balance  : Rs.1,25,000.00")
    print(f"  Acc No   : 100200300400")
    print(f"  Loans    : 1 approved (Rs.3,00,000 Personal Loan)")
    print(f"  Txns     : {len(sample_txns)} sample transactions")
    print("="*50 + "\n")
