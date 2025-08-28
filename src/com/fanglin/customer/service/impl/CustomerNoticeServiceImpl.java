package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerNoticeDao;
import com.fanglin.customer.po.CustomerNoticePO;
import com.fanglin.customer.service.CustomerNoticeService;
import com.fanglin.customer.vo.CustomerNoticeVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Paging;

@Service("customerNoticeService")
@Transactional(readOnly = true)
public class CustomerNoticeServiceImpl implements CustomerNoticeService {

	@Autowired
	private CustomerNoticeDao customerNoticeDao;

	@Override
	public void pageCustomerNotice(Paging paging, List<Filter> filters, CustomerNoticeVO customerNoticeVO) {

		List<CustomerNoticePO> customerNoticePOs = customerNoticeDao.pageCustomerNotice(paging, filters, customerNoticeVO.getOrderId(), customerNoticeVO.getType());
		List<CustomerNoticeVO> customerNoticeVOs = new ArrayList<CustomerNoticeVO>();

		for (CustomerNoticePO customerNoticePO : customerNoticePOs) {
			customerNoticeVOs.add(customerNoticePO.ptv(new CustomerNoticeVO(new UserBaseVO())));
		}

		paging.setData(customerNoticeVOs);
	}
}
