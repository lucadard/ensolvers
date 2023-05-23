const Button = (props: any) => {
  return (
    <button
      {...props}
      className='rounded-sm px-8 py-2 capitalize hover:bg-black/10'
    >{props.children}
    </button>
  )
}

export default Button
