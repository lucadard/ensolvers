const Button = (props: any) => {
  return (
    <button
      {...props}
      className='rounded-full border px-4 py-2 capitalize hover:bg-black/10 md:px-8'
    >{props.children}
    </button>
  )
}

export default Button
