package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.VillageDao;
import com.fanglin.communion.po.VillagePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentTypeVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerSourceDao;
import com.fanglin.customer.po.CustomerSourcePO;
import com.fanglin.customer.service.CustomerSourceService;
import com.fanglin.customer.vo.CustomerSourceVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerSourceService")
@Transactional(readOnly = true)
public class CustomerSourceServiceImpl implements CustomerSourceService {

	@Autowired
	private CustomerSourceDao customerSourceDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private VillageDao villageDao;

	@Override
	public void pageCustomerSource(Paging paging, List<Filter> filters) {

		List<CustomerSourcePO> customerSourcePOs = customerSourceDao.pageCustomerSource(paging, filters);
		List<CustomerSourceVO> customerSourceVOs = new ArrayList<CustomerSourceVO>();

		for (CustomerSourcePO customerSourcePO : customerSourcePOs) {
			customerSourceVOs.add(customerSourcePOToVO(customerSourcePO));
		}

		paging.setData(customerSourceVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerSource(CustomerSourceVO customerSourceVO, String userId) {

		CustomerSourcePO customerSourcePO = new CustomerSourcePO();

		BeanUtil.copyProperties(customerSourceVO, customerSourcePO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		UserPO userPO = userDao.queryUserByUserId(userId);

		customerSourcePO.setCreater(userPO);
		customerSourcePO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerSourcePO.setStatus(CustomerSourcePO.STATUS_INIT_INT);

		if (customerSourceVO.getDesigner() != null && customerSourceVO.getDesigner().getUserId() != null) {
			customerSourcePO.setDesigner(userDao.queryUserByUserId(customerSourceVO.getDesigner().getUserId()));
		}

		if (customerSourceVO.getSalesman() != null && customerSourceVO.getSalesman().getUserId() != null) {
			customerSourcePO.setSalesman(userDao.queryUserByUserId(customerSourceVO.getSalesman().getUserId()));
		}

		VillagePO villagePO = villageDao.get(customerSourceVO.getVillage().getNo());

		customerSourcePO.setVillage(villagePO);

		customerSourceDao.save(customerSourcePO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerSourceForStatus(CustomerSourceVO customerSourceVO) throws FLException {

		CustomerSourcePO customerSourcePO = customerSourceDao.get(customerSourceVO.getCsid());

		if (customerSourcePO == null) {
			throw new FLException(330071, "客户资源不存在");
		}

		customerSourcePO.setStatus(customerSourcePO.getStatus());

		customerSourceDao.update(customerSourcePO);
	}

	public CustomerSourceVO customerSourcePOToVO(CustomerSourcePO customerSourcePO) {

		CustomerSourceVO customerSourceVO = new CustomerSourceVO(new VillageVO(new CityProperVO()), new UserBaseVO(), new CustomerVO(), new HouseVO(), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())), new UserBaseVO(new DutyVO(), new DepartmentVO(new DepartmentTypeVO(), new DepartmentVO(), new UserVO())));

		BeanUtil.copyProperties(customerSourcePO, customerSourceVO, Arrays.asList("village", "creater", "customer", "house", "designer", "salesman"));

		if (customerSourcePO.getVillage() != null) {
			BeanUtil.copyProperties(customerSourcePO.getVillage(), customerSourceVO.getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(customerSourcePO.getVillage().getCityProper(), customerSourceVO.getVillage().getCityProper(), Arrays.asList("city"));
		}

		BeanUtil.copyProperties(customerSourcePO.getCreater(), customerSourceVO.getCreater(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerSourcePO.getCustomer(), customerSourceVO.getCustomer());
		BeanUtil.copyProperties(customerSourcePO.getHouse(), customerSourceVO.getHouse(), Arrays.asList("village"));
		BeanUtil.copyProperties(customerSourcePO.getDesigner(), customerSourceVO.getDesigner(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerSourcePO.getSalesman(), customerSourceVO.getSalesman(), Arrays.asList("dept", "duty"));

		if (customerSourcePO.getDesigner() != null) {
			BeanUtil.copyProperties(customerSourcePO.getDesigner().getDept(), customerSourceVO.getDesigner().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerSourcePO.getDesigner().getDept().getFatherDept(), customerSourceVO.getDesigner().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		if (customerSourcePO.getSalesman() != null) {
			BeanUtil.copyProperties(customerSourcePO.getSalesman().getDept(), customerSourceVO.getSalesman().getDept(), Arrays.asList("type", "fatherDept", "manager"));
			BeanUtil.copyProperties(customerSourcePO.getSalesman().getDept().getFatherDept(), customerSourceVO.getSalesman().getDept().getFatherDept(), Arrays.asList("type", "fatherDept", "manager"));
		}

		return customerSourceVO;
	}

}
