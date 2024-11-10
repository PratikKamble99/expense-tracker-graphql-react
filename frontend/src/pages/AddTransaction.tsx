import TransactionForm from '@/components/TransactionForm'
import React from 'react'

const AddTransaction = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
        <p className='text-4xl font-bold mb-4'> Add Transaction</p>
      <TransactionForm/>
    </div>
  )
}

export default AddTransaction
