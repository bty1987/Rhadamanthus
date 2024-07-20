package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerSourceRecordDao;
import com.fanglin.customer.po.CustomerSourceRecordPO;
import com.fanglin.customer.service.CustomerSourceRecordService;
import com.fanglin.customer.vo.CustomerSourceRecordVO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerSourceRecordService")
@Transactional(readOnly = true)
public class CustomerSourceRecordServiceImpl implements CustomerSourceRecordService {

	@Autowired
	private CustomerSourceRecordDao customerSourceRecordDao;

	@Override
	public void pageCustomerSourceRecord(Paging paging, List<Filter> filters, CustomerSourceRecordVO customerSourceRecord) {

		List<CustomerSourceRecordPO> customerSourceRecordPOs = customerSourceRecordDao.pageCustomerSourceRecord(paging, filters, customerSourceRecord.getCsid());
		List<CustomerSourceRecordVO> customerSourceRecordVOs = new ArrayList<CustomerSourceRecordVO>();

		for(CustomerSourceRecordPO customerSourceRecordPO : customerSourceRecordPOs){

			CustomerSourceRecordVO customerSourceRecordVO = new CustomerSourceRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));

			BeanUtil.copyPropertie(customerSourceRecordPO,customerSourceRecordVO, Arrays.asList("operater"));
			BeanUtil.copyPropertie(customerSourceRecordPO.getOperater(),customerSourceRecordVO.getOperater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			customerSourceRecordVOs.add(customerSourceRecordVO);
		}

		paging.setData(customerSourceRecordVOs);
	}

	@Override
	public List<CustomerSourceRecordVO> queryCustomerSourceRecord(CustomerSourceRecordVO customerSourceRecord) {

		List<CustomerSourceRecordPO> customerSourceRecordPOs = customerSourceRecordDao.queryCustomerSourceRecord(customerSourceRecord.getCsid());
		List<CustomerSourceRecordVO> customerSourceRecordVOs = new ArrayList<CustomerSourceRecordVO>();

		for(CustomerSourceRecordPO customerSourceRecordPO : customerSourceRecordPOs){

			CustomerSourceRecordVO customerSourceRecordVO = new CustomerSourceRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));

			BeanUtil.copyPropertie(customerSourceRecordPO,customerSourceRecordVO, Arrays.asList("operater"));
			BeanUtil.copyPropertie(customerSourceRecordPO.getOperater(),customerSourceRecordVO.getOperater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			customerSourceRecordVOs.add(customerSourceRecordVO);
		}

		return customerSourceRecordVOs;
	}
}
