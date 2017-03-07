describe("test", function () {
  beforeAll(() => {
    document.body.innerHTML = __html__['index.html'];
  });
  it("index page should have ", function () {
    expect($($('.title ')[0]).text()).toEqual('gulp-web-starter');
  });

  it("add function should have ", function () {
    expect(add(1,2)).toEqual(3);
  });
});