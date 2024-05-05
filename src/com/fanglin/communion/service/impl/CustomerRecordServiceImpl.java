package com.fanglin.communion.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerRecordDao;
import com.fanglin.communion.po.CustomerRecordPO;
import com.fanglin.communion.service.CustomerRecordService;
import com.fanglin.communion.vo.CustomerRecordVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerRecordService")
@Transactional(readOnly = true)
public class CustomerRecordServiceImpl implements CustomerRecordService {

	@Autowired
	private CustomerRecordDao customerRecordDao;

	@Autowired
	public UserDao userDao;

	@Override
	public void pageCustomerRecord(Paging paging, List<Filter> filters, CustomerRecordVO customerRecordVO) {

		List<CustomerRecordVO> customerRecordVOs = new ArrayList<CustomerRecordVO>();

		List<CustomerRecordPO> customerRecordPOs = customerRecordDao.pageCustomerRecord(paging, filters, customerRecordVO.getCid());

		for (CustomerRecordPO customerRecordPO : customerRecordPOs) {

			customerRecordVO = new CustomerRecordVO(new UserBaseVO(new DutyVO()));

			BeanUtil.copyPropertie(customerRecordPO, customerRecordVO, Arrays.asList("operater"));
			BeanUtil.copyPropertie(customerRecordPO.getOperater(), customerRecordVO.getOperater());
			BeanUtil.copyPropertie(customerRecordPO.getOperater().getDuty(), customerRecordVO.getOperater().getDuty());

			customerRecordVOs.add(customerRecordVO);
		}

		paging.setData(customerRecordVOs);

	}

	@Override
	public List<CustomerRecordVO> queryCustomerRecord(CustomerRecordVO customerRecord) {

		List<CustomerRecordPO> customerRecordPOs = customerRecordDao.queryCustomerRecord(customerRecord.getCid());
		List<CustomerRecordVO> customerRecordVOs = new ArrayList<CustomerRecordVO>();

		for (CustomerRecordPO customerRecordPO : customerRecordPOs) {

			CustomerRecordVO customerRecordVO = new CustomerRecordVO(new UserBaseVO(new DutyVO(), new DepartmentVO()));

			BeanUtil.copyPropertie(customerRecordPO, customerRecordVO, Arrays.asList("operater"));
			BeanUtil.copyPropertie(customerRecordPO.getOperater(), customerRecordVO.getOperater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			customerRecordVOs.add(customerRecordVO);
		}

		return customerRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerRecord(CustomerRecordVO customerRecord, String userId) {

		CustomerRecordPO customerRecordPOs = new CustomerRecordPO();

		BeanUtil.copyPropertie(customerRecord, customerRecordPOs, Arrays.asList("operater"));

		customerRecordPOs.setOperater(userDao.queryUserByUserId(userId));
		customerRecordPOs.setType(CustomerRecordPO.TYPE_QUERY_INT);
		customerRecordPOs.setOperateTime(new Timestamp(System.currentTimeMillis()));

		customerRecordDao.save(customerRecordPOs);
	}

}
