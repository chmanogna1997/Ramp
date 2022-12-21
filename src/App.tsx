import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)
  // RELATED TO BUG 4 : creating a new state
  const result : any[] = [];
  const [dataIs, setDataIs] = useState(result)



 

  const transactions = useMemo(
    () => {

    //BUG 4 : FIXING VIEWMORE BUTTON : TO APPEND THE DATA

      // RELATED TO BUG 4 :  getting the data
      var display_data = paginatedTransactions?.data ?? transactionsByEmployee ?? null
      // RELATED TO BUG 4: if data is not null we are appending it
      if(display_data !== null){

      //RELATED TO BUG 4:appending new list to previous list
      var newdata = dataIs.concat(display_data)


      // RELATED TO BUG 4: here we are updating thw newdata
      setDataIs(newdata)
      return newdata
      }
      // RELATED TO BUG 4: else we are returning null
      else{
        paginatedTransactionsUtils.loading = true
        return null

       }
    },
    [paginatedTransactions, transactionsByEmployee]
  )


  const loadAllTransactions = useCallback(async () => {

    // BUG 5 : CHANGING THE SETLOADING FALSE: AFTER FETCHING EMPLOYEES(AFTER AWAIT EMPLOYEEUTILS.FETCHALL) 
    // ONCE EMPLOYEES ARE FETCHED IT WILL STOP SHOWING THE LOADING MESSAGE
    setIsLoading(true)
    transactionsByEmployeeUtils.invalidateData()
    await employeeUtils.fetchAll()
    setIsLoading(false)

    await paginatedTransactionsUtils.fetchAll()
    
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {

      
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {

            // RELATED TO BUG 4: onchange of value im setting the array to [] => so new values are appended corresponding to the employee
            setDataIs(result)

            if (newValue === null) {
              return
            }
            else{

              if(newValue.id === ''){
                loadAllTransactions()
              }else{
            await loadTransactionsByEmployee(newValue.id)
              }
            }
          }}
        />

        <div className="RampBreak--l" />
        <div className="RampGrid">
          <Transactions transactions={transactions} />

        

          {transactions !== null && (
            <button
              className="RampButton"
              // BUG 6 :: WE ARE DISABLING THE BUTTON IF NEXT PAGE IS NULL CHECKING PAGINATEDTRANSACTIONS.NEXTPAGE
              //  AS THERE IS NO DATA TO DISPLAY FURTHER
              disabled={paginatedTransactionsUtils.loading || paginatedTransactions?.nextPage === null}
              
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
