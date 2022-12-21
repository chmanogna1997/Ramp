import { Console } from "console"
import { useState } from "react"
import { InputCheckbox } from "../InputCheckbox"
import { TransactionPaneComponent } from "./types"

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved)

  


  const [checkedList, setCheckedList] = useState(["1"])
  const [unCheckedList, setunCheckedList] = useState(["1"])


  return (
    <div className="RampPane">
      <p> {checkedList}</p>
      <p> unchecked next</p>
      <p>{unCheckedList}</p>
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant} </p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading}
        onChange={async (newValue) => {
          console.log("in transaction pane", newValue, transaction.id)
          await consumerSetTransactionApproval({
            transactionId: transaction.id,
            newValue,
          })

          setApproved(newValue)

          console.log('checking if includes' , checkedList.includes(transaction.id))
          console.log(" check if approved", approved)

          // if(!approved){
          //   if(!checkedList.includes(transaction.id)){
          //     // var new_list = checkedList.push(transaction.id)
          //     setCheckedList([...checkedList, transaction.id])
          //   }

          //   if(unCheckedList.includes(transaction.id)){
          //     var filteredlist = unCheckedList.filter(item => item !== transaction.id)
          //     setCheckedList(filteredlist)
          //   }
          // }


        }}
      />
    </div>
  )
}

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})
