import Observer from "./Observer"

describe('Test observer class', ()=> {
  const observer = new Observer();
  const mockFn = jest.fn(()=>{})

  afterAll(() => {
    jest.clearAllMocks();
  });

  test('subscribe method', () => {
    observer.subscribe(mockFn);
    expect(observer.observers.length).toBe(1);
  });

  test('broadcast method', () => {
    observer.broadcast(10,20);
    expect(mockFn).toBeCalled()
    expect(mockFn).toBeCalledTimes(1)
    expect(mockFn).toHaveBeenLastCalledWith(10,20)
  });
})