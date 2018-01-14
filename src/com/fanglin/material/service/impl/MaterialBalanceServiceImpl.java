/**
 * @File Name		: MaterialBalanceServiceImpl.java
 * @Package   	: com.fanglin.material.service.impl
 * @Version		: 1.0
 * @Date			: 2016-9-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.dao.SupplierDao;
import com.fanglin.data.common.dao.SupplierUserRightDao;
import com.fanglin.data.common.vo.CustomerVO;
import com.fanglin.data.common.vo.HouseVO;
import com.fanglin.data.common.vo.VillageVO;
import com.fanglin.data.po.SupplierPO;
import com.fanglin.data.po.SupplierUserRightPO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.material.dao.MaterialBalanceDao;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.po.MaterialBalancePO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.material.service.MaterialBalanceService;
import com.fanglin.material.vo.MaterialBalanceVO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialBalanceService")
@Transactional(readOnly=true)
public class MaterialBalanceServiceImpl implements MaterialBalanceService {
	
	@Autowired
	private MaterialBalanceDao materialBalanceDao;
	
	@Autowired
	private MaterialDao materialDao;
	
	@Autowired
	private SupplierDao supplierDao;
	
	@Autowired
	private SupplierUserRightDao supplierUserRightDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void pageMaterialBalance(Paging paging, List<Filter> filters,int company) {
		if(filters.size() == 0) return;
	
		List<MaterialBalancePO> materialBalancePOs = materialBalanceDao.pageMaterialBalance(paging, filters,company);
		List<MaterialBalanceVO> materialBalanceVOs = new ArrayList<MaterialBalanceVO>();
		
		MaterialBalanceVO materialBalanceVO;
		
		for(MaterialBalancePO materialBalancePO: materialBalancePOs){
			
			materialBalanceVO = new MaterialBalanceVO(new MaterialVO(new HouseVO(new VillageVO()), new CustomerVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new DepartmentVO(), new DepartmentVO() ,new DepartmentVO()), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(materialBalancePO, materialBalanceVO, "material", "creater", "instorer", "poster");
			BeanUtil.copyProperties(materialBalancePO.getMaterial(), materialBalanceVO.getMaterial(), "house", "customer", "salesman", "materialer", "instorer", "region", "department", "materialDepartment");
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getHouse(), materialBalanceVO.getMaterial().getHouse(), "village");
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getHouse().getVillage(), materialBalanceVO.getMaterial().getHouse().getVillage(), "cityProper");
			
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getCustomer(), materialBalanceVO.getMaterial().getCustomer());
			
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getSalesman(), materialBalanceVO.getMaterial().getSalesman(), "dept", "duty");
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getMaterialer(), materialBalanceVO.getMaterial().getMaterialer(), "dept", "duty");
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getInstorer(), materialBalanceVO.getMaterial().getInstorer(), "dept", "duty");
			
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getRegion(), materialBalanceVO.getMaterial().getRegion(), "type", "fatherDept", "cityProper");
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getDepartment(), materialBalanceVO.getMaterial().getDepartment(), "type", "fatherDept", "cityProper");
			BeanUtil.copyProperties(materialBalancePO.getMaterial().getMaterialDepartment(), materialBalanceVO.getMaterial().getMaterialDepartment(), "type", "fatherDept", "cityProper");
			
			materialBalanceVO.getCreater().setBaseInfo(materialBalancePO.getCreater());
			materialBalanceVO.getInstorer().setBaseInfo(materialBalancePO.getInstorer());
			materialBalanceVO.getPoster().setBaseInfo(materialBalancePO.getPoster());
			
			materialBalanceVOs.add(materialBalanceVO);
		}
		
		paging.setData(materialBalanceVOs);
	}

	@Override
	public void pageMaterialBalanceForVender(Paging paging, List<Filter> filters, String userId,int company) throws FLException {
		
		SupplierPO supplierPO = supplierDao.querySupplierByLoginId(userId);
		
		if (supplierPO == null) {
			throw new FLException(130008, "厂商不存在");
		}
		
		List<SupplierUserRightPO> supplierUserRightPOs = supplierUserRightDao.querySupplierUserRightBySId(supplierPO.getSid());
		List<String> userIds = new ArrayList<String>();
		
		for(SupplierUserRightPO supplierUserRightPO: supplierUserRightPOs){
			userIds.add(supplierUserRightPO.getUser().getUserId());
		}
		
		filters.add(new Filter(MaterialBalancePO.COLUMN_USERID_STR, userIds, "in"));
		
		List<MaterialBalancePO> materialBalancePOs = materialBalanceDao.pageMaterialBalance(paging, filters,company);
		List<MaterialBalanceVO> materialBalanceVOs = new ArrayList<MaterialBalanceVO>();
		
		MaterialBalanceVO materialBalanceVO;
		
		for(MaterialBalancePO materialBalancePO: materialBalancePOs){
			
			materialBalanceVO = new MaterialBalanceVO(new MaterialVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			BeanUtil.copyProperties(materialBalancePO, 	materialBalanceVO, "material", "creater", "instorer", "poster");
			BeanUtil.copyProperties(materialBalancePO.getMaterial(), materialBalanceVO.getMaterial());
			
			materialBalanceVO.getCreater().setBaseInfo(materialBalancePO.getCreater());
			materialBalanceVO.getInstorer().setBaseInfo(materialBalancePO.getInstorer());
			materialBalanceVO.getPoster().setBaseInfo(materialBalancePO.getPoster());
			
			materialBalanceVOs.add(materialBalanceVO);
		}
		
		paging.setData(materialBalanceVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialBalanceForVBalance(MaterialBalanceVO materialBalanceVO) throws FLException {
		
		List<Short> status = Arrays.asList(MaterialBalancePO.STATUS_VENDER_BALANCE_INT, MaterialBalancePO.STATUS_FINISH_INT);
		
		MaterialBalancePO materialBalancePO = materialBalanceDao.get(materialBalanceVO.getMbid());
		
		if(materialBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(status.contains(materialBalancePO.getStatus())){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		
		materialBalancePO.setVbalance(materialBalanceVO.getVbalance());
		
		materialBalanceDao.update(materialBalancePO);
	}
 
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void vpostMaterialBalance(MaterialBalanceVO materialBalanceVO) throws FLException {
		
		MaterialBalancePO materialBalancePO = materialBalanceDao.get(materialBalanceVO.getMbid());
		
		if(materialBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		} 
		
		if(materialBalancePO.getStatus() != MaterialBalancePO.STATUS_PRE_BALANCE_INT){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		
		materialBalancePO.setVbalanceTime(DateUtil.getDateToTimestamp(new Date()));
		materialBalancePO.setStatus(MaterialBalancePO.STATUS_VENDER_BALANCE_INT);
		
		materialBalanceDao.update(materialBalancePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialBalanceForBalance(MaterialBalanceVO materialBalanceVO) throws FLException {
		
		MaterialBalancePO materialBalancePO = materialBalanceDao.get(materialBalanceVO.getMbid());
		
		if(materialBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(materialBalancePO.getStatus() == MaterialBalancePO.STATUS_FINISH_INT){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		materialBalancePO.setPost(materialBalanceVO.getBalance());
		materialBalanceDao.update(materialBalancePO);
	
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void postMaterialBalance(MaterialBalanceVO materialBalanceVO, String userId) throws FLException {

		MaterialBalancePO materialBalancePO = materialBalanceDao.get(materialBalanceVO.getMbid());
		
		if(materialBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(materialBalancePO.getStatus() != MaterialBalancePO.STATUS_VENDER_BALANCE_INT){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		
		materialBalancePO.setPoster(userDao.queryUserByUserId(userId));
		materialBalancePO.setPostTime(DateUtil.getDateToTimestamp(new Date()));
		materialBalancePO.setStatus(MaterialBalancePO.STATUS_FINISH_INT);
		
		MaterialPO materialPO = materialBalancePO.getMaterial();
		
		materialPO.setStatus(MaterialPO.STATUS_TYPE_POSTBALANCE_INT);
		materialPO.setBalanceStatus(MaterialPO.BALANCE_STATUS_TYPE_POST_INT);
		materialDao.update(materialPO);
		materialBalanceDao.update(materialBalancePO);
	}

}
