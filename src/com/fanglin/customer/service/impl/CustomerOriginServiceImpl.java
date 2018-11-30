package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.CustomerOriginDao;
import com.fanglin.customer.dao.CustomerRecordDao;
import com.fanglin.customer.po.CustomerOriginPO;
import com.fanglin.customer.po.CustomerRecordPO;
import com.fanglin.customer.service.CustomerOriginService;
import com.fanglin.customer.vo.CustomerOriginVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.right.dao.CustomerSourceRightDao;
import com.fanglin.right.po.CustomerSourceRightPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("customerOriginService")
@Transactional(readOnly = true)
public class CustomerOriginServiceImpl implements CustomerOriginService {
	
	@Autowired
	private CustomerOriginDao customerOriginDao;
	
	@Autowired
	private CustomerSourceRightDao customerSourceRightDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private CustomerRecordDao customerRecordDao;
	
	@Override
	public void pageCustomerOrigin(Paging paging, List<Filter> filters, String userId) {
		
		filters.add(new Filter("belonger", userId, "eq"));
		
		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, null);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();
		
		for(CustomerOriginPO customerOriginPO : customerOriginPOs){
			customerOriginVOs.add(customerOriginPOToVO(customerOriginPO));
		}
		
		paging.setData(customerOriginVOs);
	}
	
	@Override
	public void pageCustomerOriginForAdvance(Paging paging, List<Filter> filters, String userId) {

		UserPO userPO = userDao.queryUserByUserId(userId);
		
		List<CustomerSourceRightPO> customerSourceRightPOs = customerSourceRightDao.queryCustomerSourceRightByUserId(userPO.getUid(), userPO.getCompany());
		
		List<Integer> dids = new ArrayList<Integer>();
		
		for (CustomerSourceRightPO customerSourceRightPO : customerSourceRightPOs) {
			dids.add(customerSourceRightPO.getDid());
		}
		
		if(dids.size() == 1 && dids.get(0) == CustomerSourceRightPO.DEPARTMENT_ALL_ENABLE_INT){
			dids = null;
		}else if(dids.size() == 0){
			return;
		}
		
		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters, dids);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();
		
		for (CustomerOriginPO customerOriginPO : customerOriginPOs) {
			CustomerOriginVO houseSourceVO = customerOriginPOToVO(customerOriginPO);
			customerOriginVOs.add(houseSourceVO);
		}
		
		paging.setData(customerOriginVOs);
	}
	
	@Override
	public void pageCustomerOriginForCommunion(Paging paging, List<Filter> filters) {
		
		Filter filter = new Filter();
		filter.setData(null);
		filter.setField("belonger.uid");
		filter.setOp("eq");
		filters.add(filter);
		
		List<CustomerOriginPO> customerOriginPOs = customerOriginDao.pageCustomerOrigin(paging, filters,null);
		List<CustomerOriginVO> customerOriginVOs = new ArrayList<CustomerOriginVO>();
		
		for(CustomerOriginPO customerOriginPO : customerOriginPOs){
			customerOriginVOs.add(customerOriginPOToVO(customerOriginPO));
		}
		
		paging.setData(customerOriginVOs);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) {
		
		CustomerOriginPO customerOriginPO = new CustomerOriginPO();

		BeanUtil.copyProperties(customerOriginVO, customerOriginPO, Arrays .asList("customer", "creater", "createTime", "belonger", "department", "region"));

		customerOriginPO.setCustomer(new CustomerPO(customerOriginVO.getCustomer().getCid()));
		customerOriginPO.setCreater(userDao.queryUserByUserId(userId));
		customerOriginPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		customerOriginPO.setStatus((short)0);	
		
		if(customerOriginVO.getBelonger().getUid() != null){ 
			
			UserPO createrPOs = userDao.get(customerOriginVO.getBelonger().getUid());
			
			customerOriginPO.setBelonger(createrPOs);
			customerOriginPO.setDepartment(createrPOs.getDept());
			customerOriginPO.setRegion(createrPOs.getDept().getFatherDept());
		}
		
		customerOriginDao.save(customerOriginPO);
		
		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原电话:%s,原目的:%s,原意向:%s,原价格:%s,原等级:%s", customerOriginPO.getPhone(), customerOriginPO.getPurpose(), customerOriginPO.getIntention(), customerOriginPO.getPrice(), customerOriginPO.getGrade()), (short)1, userDao.queryUserByUserId(userId));
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());
		
		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原电话:%s,原目的:%s,原意向:%s,原价格:%s,原等级:%s,新电话:%s,新目的:%s,新意向:%s,新价格:%s,新等级:%s", customerOriginPO.getPhone(), customerOriginPO.getPurpose(), customerOriginPO.getIntention(), customerOriginPO.getPrice(), customerOriginPO.getGrade(), customerOriginVO.getPhone(), customerOriginVO.getPurpose(), customerOriginVO.getIntention(), customerOriginVO.getPrice(), customerOriginVO.getGrade()), (short)0, userDao.queryUserByUserId(userId));
		
		BeanUtil.copyPropertie(customerOriginVO, customerOriginPO, Arrays.asList("csid", "customer", "creater", "createTime", "belonger", "department", "region"));
		
		customerOriginDao.update(customerOriginPO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCustomerOriginForBelonger(CustomerOriginVO customerOriginVO, String userId) throws FLException {
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());
		
		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		BeanUtil.copyPropertie(customerOriginVO, customerOriginPO, Arrays.asList("customer", "creater", "createTime", "belonger", "department", "region"));
		
		UserPO belonger=userDao.get(customerOriginVO.getBelonger().getUid());
		
		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原归属人:%s,原归属部门:%s,原归属分区:%s,新归属人:%s,新归属部门:%s,新归属分区:%s", customerOriginPO.getBelonger().getUserName(), customerOriginPO.getBelonger().getDept().getName(), customerOriginPO.getBelonger().getDept().getFatherDept().getName(), belonger.getUserName(), belonger.getDept().getName(), belonger.getDept().getFatherDept().getName()), (short)1, userDao.queryUserByUserId(userId));
		
		customerOriginPO.setBelonger(belonger);
		customerOriginPO.setDepartment(belonger.getDept());
		customerOriginPO.setRegion(belonger.getDept().getFatherDept());
		
		customerOriginDao.update(customerOriginPO);
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void freeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());
		
		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		if(!userId.equals(customerOriginPO.getBelonger().getUserId())){
			throw new FLException(330002, "客源归属人错误");
		}
		
		creatCustomerRecord(customerOriginPO.getCsid(), String.format("原归属人姓名:%s,原归属人员工号:%s,原归属人电话:%s", customerOriginPO.getBelonger().getUserName(), userId, userDao.queryUserByUserId(userId).getPhone()), (short)1, userDao.queryUserByUserId(userId));
		
		BeanUtil.copyPropertie(customerOriginVO, customerOriginPO, Arrays.asList("customer", "creater", "createTime", "belonger", "department", "region"));
		
		customerOriginPO.setBelonger(null);
		
		customerOriginDao.update(customerOriginPO);
		
	}
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void takeCustomerOrigin(CustomerOriginVO customerOriginVO, String userId) throws FLException {
		
		CustomerOriginPO customerOriginPO = customerOriginDao.get(customerOriginVO.getCsid());
		
		if(customerOriginPO == null){
			throw new FLException(330001, "客源不存在");
		}
		
		if(userDao.queryUserByUserId(userId) == null){
			throw new FLException(330002, "客源归属人错误");
		}
			
		UserPO belonger = userDao.queryUserByUserId(userId);
		
		BeanUtil.copyPropertie(customerOriginVO, customerOriginPO, Arrays.asList("customer", "creater", "createTime", "belonger", "department", "region"));
		BeanUtil.copyPropertie(customerOriginVO.getBelonger(), customerOriginPO.getBelonger(), Arrays.asList("dept","duty"));
		  
		customerOriginPO.setBelonger(belonger);	
		customerOriginPO.setDepartment(belonger.getDept());
		customerOriginPO.setRegion(belonger.getDept().getFatherDept());
			
		customerOriginDao.update(customerOriginPO);
		
		creatCustomerRecord(customerOriginPO.getCsid(), String.format("认领人姓名:%s,认领人员工号:%s,认领人电话:%s", userDao.queryUserByUserId(userId).getUserName(), userId, userDao.queryUserByUserId(userId).getPhone()), (short)1, userDao.queryUserByUserId(userId));

	}
	
	public CustomerOriginVO customerOriginPOToVO(CustomerOriginPO customerOriginPO){

		CustomerOriginVO customerOriginVO = new CustomerOriginVO(new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO());
		
		BeanUtil.copyProperties(customerOriginPO, customerOriginVO, Arrays.asList("customer","creater","createTime","belonger","department","region"));
		BeanUtil.copyProperties(customerOriginPO.getCustomer(), customerOriginVO.getCustomer());
		BeanUtil.copyProperties(customerOriginPO.getCreater(), customerOriginVO.getCreater(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerOriginPO.getBelonger(), customerOriginVO.getBelonger(), Arrays.asList("dept", "duty"));
		BeanUtil.copyProperties(customerOriginPO.getDepartment(), customerOriginVO.getDepartment(), Arrays.asList("type", "fatherDept", "manager"));
		BeanUtil.copyProperties(customerOriginPO.getRegion(), customerOriginVO.getRegion(), Arrays.asList("type", "fatherDept", "manager"));
		
		customerOriginVO.setCreateTime(customerOriginPO.getCreateTime());
		
		return customerOriginVO;
		
	}
	
	public void creatCustomerRecord(long csid , String comment , Short type , UserPO operater){
		
		CustomerRecordPO customerRecordPO = new CustomerRecordPO();
		
		customerRecordPO.setCsid(csid);
		customerRecordPO.setComment(comment);
		customerRecordPO.setType(type);
		customerRecordPO.setOperater(operater);
		customerRecordPO.setOperatTime(new Timestamp(System.currentTimeMillis()));
		
		customerRecordDao.save(customerRecordPO);
	}
}
