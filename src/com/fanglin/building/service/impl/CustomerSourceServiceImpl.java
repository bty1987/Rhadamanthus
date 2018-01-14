package com.fanglin.building.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.building.dao.CustomerSourceDao;
import com.fanglin.building.po.CustomerSourcePO;
import com.fanglin.building.service.CustomerSourceService;
import com.fanglin.building.vo.CustomerSourceVO;
import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.CustomerDao;
import com.fanglin.data.common.dao.CustomerPhoneDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.po.CustomerPO;
import com.fanglin.data.po.CustomerPhonePO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("customerSourceService")
@Transactional(readOnly=true)
public class CustomerSourceServiceImpl implements CustomerSourceService {

	@Autowired
	private CustomerSourceDao customerSourceDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CustomerDao customerDao;
	
	@Autowired
	private CustomerPhoneDao customerPhoneDao;
	
	@Autowired
	private CountingService countingService;
	
	@Override
	public void pageCustomerSource(Paging paging, List<Filter> filters, String userId) {
		
		UserPO user = userDao.queryUserByUserId(userId);
		
		List<CustomerSourcePO> customerSourcePOs = customerSourceDao.pageCustomerSource(paging, filters, user.getUid());
		List<CustomerSourceVO> customerSourceVOs = new ArrayList<CustomerSourceVO>();
		
		for (CustomerSourcePO customerSourcePO : customerSourcePOs) {
			customerSourceVOs.add(customerSourcePOToVO(customerSourcePO));
		}
		
		paging.setData(customerSourceVOs);

	}
	
	@Override
	public CustomerSourceVO queryCustomerSourceByCsid(CustomerSourceVO customerSource) {
		
		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSource.getCsid());
		
		CustomerSourceVO customerSourceVO = customerSourcePOToVO(customerSourcePO);
		
		return customerSourceVO;
		
	}
	
	@Override
	public CustomerSourceVO queryCustomerSourceForNo(CustomerSourceVO customerSource) throws FLException {
		
		CustomerSourcePO customerSourcePO = customerSourceDao.queryCustomerSourceForNo(customerSource.getNo());
		
		if(customerSourcePO == null){
			throw new FLException(320008, "客源不存在");
		}
		
		CustomerSourceVO customerSourceVO = customerSourcePOToVO(customerSourcePO);
		
		return customerSourceVO;
	}
	
	@Override
	public CustomerSourceVO checkCustomerSourceByCidAndType(CustomerSourceVO customerSource) throws FLException {
		
		CustomerSourcePO customerSourcePO = customerSourceDao.checkCustomerSourceByCidAndType(customerSource.getCustomer().getCid(), customerSource.getType());
		
		if(customerSourcePO == null){
			throw new FLException(320008, "客源不存在");
		}
		
		CustomerSourceVO customerSourceVO = customerSourcePOToVO(customerSourcePO);
		
		return customerSourceVO;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addCustomerSource(CustomerSourceVO customerSourceVO, String userId) throws FLException {
		
		Integer customerSourceCount = customerSourceDao.countCustomerSource(customerSourceVO.getCustomer().getCid(), customerSourceVO.getType());
		
		if(customerSourceCount > 0){
			throw new FLException(320007, "客源已存在");
		}
		
		UserPO createPO = userDao.queryUserByUserId(userId);
		CustomerPO customerPO = customerDao.get(customerSourceVO.getCustomer().getCid());
		
		CustomerSourcePO customerSourcePO = new CustomerSourcePO(customerPO, createPO);
		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("customer", "create"));
		
		customerSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_INIT_SHORT);
		
		//NO
		String currentDate = DateUtil.current("yyyyMMdd").toString().substring(2);
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_DECORATION_ORDER_INT, currentDate);
		
		String no = "C" + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");
		
		customerSourcePO.setNo(no);
		
		customerSourceDao.save(customerSourcePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCustomerSource(CustomerSourceVO customerSourceVO) throws FLException {
		
		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());
		
		if(customerSourcePO == null){
			throw new FLException(320008, "客源不存在");
		}
		
		if(customerSourcePO.getStatus() == 2){
			throw new FLException(320009, "客源状态不可操作");
		}
		
		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("customer", "create"));
		
		customerSourceDao.update(customerSourcePO);

	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateCustomerSourceForStatus(CustomerSourceVO customerSourceVO) throws FLException {
		
		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());
		
		if(customerSourcePO == null){
			throw new FLException(320008, "客源不存在");
		}
		
		if(customerSourcePO.getStatus() == 2){
			throw new FLException(320009, "客源状态不可操作");
		}
		
		customerSourcePO.setStatus(customerSourceVO.getStatus());
		
		customerSourceDao.update(customerSourcePO);

	}
	
	public CustomerSourceVO customerSourcePOToVO(CustomerSourcePO customerSourcePO){
		
		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new CustomerVO(), new UserVO());
		
		BeanUtil.copyProperties(customerSourcePO, customerSourceVO, Arrays.asList("customer", "create"));
		BeanUtil.copyProperties(customerSourcePO.getCustomer(), customerSourceVO.getCustomer());
		
		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(customerSourcePO.getCustomer().getCid(), CustomerSourcePO.STATUS_INIT_SHORT);
		
		if(customerPhones.size() > 0){
			customerSourceVO.getCustomer().setPhone(customerPhones.get(0).getPhone());
		}
		
		BeanUtil.copyProperties(customerSourcePO.getCreate(), customerSourceVO.getCreate(), Arrays.asList("role", "dept", "duty"));
		
		return customerSourceVO;
	}

}
