from bank import create_account, deposit, withdraw, check_balance, show_accounts

while True:

    print("\n------ BANK MENU ------")
    print("1. Create Account")
    print("2. Deposit Money")
    print("3. Withdraw Money")
    print("4. Check Balance")
    print("5. Show All Accounts")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice == 1:
        create_account()

    elif choice == 2:
        deposit()

    elif choice == 3:
        withdraw()

    elif choice == 4:
        check_balance()

    elif choice == 5:
        show_accounts()

    elif choice == 6:
        print("Thank you for using Bank Application")
        break

    else:
        print("Invalid Choice")