package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.customer.dao.CustomerOriginRecordDao;
import com.fanglin.customer.po.CustomerOriginRecordPO;
import com.fanglin.customer.service.CustomerOriginRecordService;
import com.fanglin.customer.vo.CustomerOriginRecordVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;

@Service("customerOriginRecordService")
@Transactional(readOnly = true)
public class CustomerOriginRecordServiceImpl implements CustomerOriginRecordService {

	@Autowired
	private CustomerOriginRecordDao customerRecordDao;

	@Autowired
	public UserDao userDao;

	@Override
	public List<CustomerOriginRecordVO> queryCustomerOriginRecord(CustomerOriginRecordVO customerOriginRecord) {

		List<CustomerOriginRecordPO> customerOriginRecordPOs = customerRecordDao.queryCustomerOriginRecord(customerOriginRecord.getCsid());
		List<CustomerOriginRecordVO> customerOriginRecordVOs = new ArrayList<CustomerOriginRecordVO>();

		for (CustomerOriginRecordPO customerOriginRecordPO : customerOriginRecordPOs) {

			CustomerOriginRecordVO CustomerOriginRecordVO = new CustomerOriginRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));

			BeanUtil.copyPropertie(customerOriginRecordPO, CustomerOriginRecordVO, Arrays.asList("operater"));
			BeanUtil.copyPropertie(customerOriginRecordPO.getOperater(), CustomerOriginRecordVO.getOperater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			customerOriginRecordVOs.add(CustomerOriginRecordVO);
		}

		return customerOriginRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerOriginRecord(CustomerOriginRecordVO customerOriginRecord, String userId) {

		CustomerOriginRecordPO customerOriginRecordPOs = new CustomerOriginRecordPO();

		BeanUtil.copyPropertie(customerOriginRecord, customerOriginRecordPOs, Arrays.asList("operater", "operatTime"));

		customerOriginRecordPOs.setOperater(userDao.queryUserByUserId(userId));
		customerOriginRecordPOs.setType((short) 0);
		customerOriginRecordPOs.setOperatTime(new Timestamp(System.currentTimeMillis()));

		customerRecordDao.save(customerOriginRecordPOs);
	}

}
