import React from "react";

const ShipmentThree = () => {
  return (
    <>
      {/* Start Our Shipment area */}
      <div className='shipment-area style-03'>
        <div className='container'>
          <div className='row justify-content-start'>
            <div className='col-lg-6'>
              <div className='shipment-form-wrap'>
                <h3 className='title'>Tính Toán Dịch Vụ</h3>
                <form id='shipment-form'>
                  <div className='personal-data'>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h4>Thông Tin Cá Nhân</h4>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <input
                            type='text'
                            className='form-control'
                            name='name'
                            id='name'
                            placeholder='Họ và Tên'
                            required=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <input
                            type='email'
                            className='form-control'
                            name='email'
                            id='email'
                            placeholder='Email'
                            required=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <input
                            type='number'
                            className='form-control'
                            name='phone'
                            id='phone'
                            placeholder='Số Điện Thoại'
                            required=''
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='shipment-date'>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <h4>Ngày Giao Hàng</h4>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <select
                            title='Vui lòng chọn'
                            className='form-control custom-select'
                            name='package1'
                            aria-required='true'
                            aria-invalid='false'
                          >
                            <option value=''>Loại Hàng</option>
                            <option value='Type 1'>Loại 1</option>
                            <option value='Type 2'>Loại 2</option>
                            <option value='Type 3'>Loại 3</option>
                            <option value='Type 4'>Loại 4</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <select
                            title='Vui lòng chọn'
                            className='form-control custom-select'
                            name='package2'
                            aria-required='true'
                            aria-invalid='false'
                          >
                            <option value=''>Thành Phố Gửi</option>
                            <option value='london'>London</option>
                            <option value='california'>California</option>
                            <option value='dhaka'>Dhaka</option>
                            <option value='new york'>New York</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <select
                            title='Vui lòng chọn'
                            className='form-control custom-select'
                            name='package3'
                            aria-required='true'
                            aria-invalid='false'
                          >
                            <option value=''>Thành Phố Nhận</option>
                            <option value='london'>London</option>
                            <option value='california'>California</option>
                            <option value='dhaka'>Dhaka</option>
                            <option value='new york'>New York</option>
                          </select>
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <input
                            type='text'
                            className='form-control'
                            name='incoterms'
                            id='incoterms'
                            placeholder='Điều khoản Incoterms'
                            required=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <input
                            type='text'
                            className='form-control'
                            name='height'
                            id='height'
                            placeholder='Chiều Cao'
                            required=''
                          />
                        </div>
                      </div>
                      <div className='col-lg-4'>
                        <div className='form-group'>
                          <input
                            type='text'
                            className='form-control'
                            name='length'
                            id='length'
                            placeholder='Chiều Dài'
                            required=''
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='submit-shipment'>
                    <div className='row'>
                      <div className='col-lg-12'>
                        <div className='shipment-process'>
                          <div className='form-group'>
                            <input
                              type='radio'
                              className='form-radio'
                              id='process1'
                              name='radio-group'
                              defaultChecked=''
                            />
                            <label htmlFor='process1'>Hàng Dễ Vỡ</label>
                            <input
                              type='radio'
                              className='form-radio'
                              id='process2'
                              name='radio-group'
                              defaultChecked=''
                            />
                            <label htmlFor='process2'>Giao Hàng Nhanh</label>
                            <input
                              type='radio'
                              className='form-radio'
                              id='process3'
                              name='radio-group'
                              defaultChecked=''
                            />
                            <label htmlFor='process3'>Bảo Hiểm</label>
                            <input
                              type='radio'
                              className='form-radio'
                              id='process4'
                              name='radio-group'
                              defaultChecked=''
                            />
                            <label htmlFor='process4'>Đóng Gói</label>
                          </div>
                        </div>
                        <div className='form-group '>
                          <button type='submit' className='shipment-btn'>
                            Yêu Cầu Báo Giá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className='col-lg-5 d-flex'>
              <div className='section-title  text-left m-auto'>
                <span className='subtitle'>Kinh Nghiệm</span>
                <h2 className='title'>
                  Chúng Tôi Có Hơn 15 Năm Kinh Nghiệm Trong Vận Chuyển
                </h2>
                <p className='sub-title'>
                  Với đội ngũ chuyên nghiệp và quy trình tối ưu, chúng tôi tự hào
                  mang đến dịch vụ vận chuyển hàng đầu cho khách hàng trong suốt 15
                  năm qua.
                </p>
                <div className='btn-wrapper  text-left'>
                  <a href='#' className='boxed-btn btn-bounce'>
                    Liên Hệ Với Chúng Tôi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Our Shipment area */}
    </>
  );
};

export default ShipmentThree;
