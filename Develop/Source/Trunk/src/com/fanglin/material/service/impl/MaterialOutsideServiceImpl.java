/**
 * @File Name		: MaterialOutsideServiceImpl.java
 * @Package   	: com.fanglin.material.service.impl
 * @Version		: 1.0
 * @Date			: 2015-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.dao.DecorationOrderDao;
import com.fanglin.decoration.po.DecorationOrderPO;
import com.fanglin.department.po.DepartmentPO;
import com.fanglin.material.dao.MaterialOutsideDao;
import com.fanglin.material.po.MaterialOutsidePO;
import com.fanglin.material.service.MaterialOutsideService;
import com.fanglin.material.vo.MaterialOutsideVO;
import com.fanglin.payment.dao.MaterialOutsidePaymentDao;
import com.fanglin.payment.po.MaterialOutsidePaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialOutsideService")
@Transactional(readOnly=true)
public class MaterialOutsideServiceImpl implements MaterialOutsideService {
	
	@Autowired
	private MaterialOutsideDao materialOutsideDao;
	
	@Autowired
	private MaterialOutsidePaymentDao materialOutsidePaymentDao;
	
	@Autowired
	private DecorationOrderDao decorationOrderDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void pageMaterialOutside(Paging paging, List<FilterVO> filters) {
		
		List<MaterialOutsidePO> materialOutsidePOs = materialOutsideDao.pageMaterialOutside(paging, filters);
		List<MaterialOutsideVO> materialOutsideVOs = new ArrayList<MaterialOutsideVO>();
		
		for(MaterialOutsidePO materialOutsidePO: materialOutsidePOs){
			MaterialOutsideVO materialOutsideVO = new MaterialOutsideVO();
			BeanUtil.copyProperties(materialOutsidePO, materialOutsideVO);
			
			materialOutsideVOs.add(materialOutsideVO);
		}
		
		paging.setData(materialOutsideVOs);
	}

	@Override
	public void pageMaterialOutsideByUserId(Paging paging, List<FilterVO> filters, String userId) {
		
		filters.add(new FilterVO(MaterialOutsidePO.COLUMN_CREATEUSERID_STR, userId, "eq"));
		
		List<MaterialOutsidePO> materialOutsidePOs = materialOutsideDao.pageMaterialOutside(paging, filters);
		List<MaterialOutsideVO> materialOutsideVOs = new ArrayList<MaterialOutsideVO>();
		
		for(MaterialOutsidePO materialOutsidePO: materialOutsidePOs){
			MaterialOutsideVO materialOutsideVO = new MaterialOutsideVO();
			BeanUtil.copyProperties(materialOutsidePO, materialOutsideVO);
			
			materialOutsideVOs.add(materialOutsideVO);
		}
		
		paging.setData(materialOutsideVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMaterialOutside(MaterialOutsideVO materialOutsideVO, String userId) throws FLException {
		
		MaterialOutsidePO materialOutsidePO = new MaterialOutsidePO();
		BeanUtil.copyProperties(materialOutsideVO, materialOutsidePO);
		
		materialOutsidePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		UserPO userPO = userDao.get(userId);
		if(userPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		DecorationOrderPO decorationOrderPO = decorationOrderDao.queryOrderByOrderId(materialOutsideVO.getOrderId());
		if(decorationOrderPO == null){
			throw new FLException(140013, "订单不存在");
		}
		
		UserPO salesmanPO = userDao.get(materialOutsideVO.getSalesmanId());
		if(salesmanPO == null){
			throw new FLException(220005, "员工不存在");
		}
		
		materialOutsidePO.setSalesmanName(salesmanPO.getUserName());
		
		DepartmentPO departmentPO = salesmanPO.getDept();
		if(departmentPO != null){
			materialOutsidePO.setDeptId(departmentPO.getDeptId());
			materialOutsidePO.setDeptName(departmentPO.getDeptName());
			
			DepartmentPO regionPO = departmentPO.getFatherDept();
			
			if(regionPO != null){
				materialOutsidePO.setRegionId(regionPO.getDeptId());
				materialOutsidePO.setRegionName(regionPO.getDeptName());
			}else{
				materialOutsidePO.setRegionId("");
				materialOutsidePO.setRegionName("");
			}
		}else{
			materialOutsidePO.setDeptId("");
			materialOutsidePO.setDeptName("");
			
			materialOutsidePO.setRegionId("");
			materialOutsidePO.setRegionName("");
		}
		
		StringBuffer orderAddr = new StringBuffer();
		orderAddr.append(decorationOrderPO.getVillagePO().getVillageName());
		orderAddr.append(" ");
		orderAddr.append(decorationOrderPO.getHouseNumber());
		
		materialOutsidePO.setOrderAddr(orderAddr.toString());
		
		materialOutsidePO.setStatus(MaterialOutsidePO.STATUS_INIT_INT);
		
		materialOutsidePO.setCreateUserId(userId);
		materialOutsidePO.setCreateUserName(userPO.getUserName());
		
		materialOutsidePO.setCustomerName(decorationOrderPO.getCustomerPO().getCustomerName());
		
		MaterialOutsidePaymentPO materialOutsidePaymentPO = new MaterialOutsidePaymentPO();
		
		materialOutsidePaymentPO.setOrderId(materialOutsideVO.getOrderId());
		materialOutsidePaymentPO.setOrderAddr(orderAddr.toString());
		
		materialOutsidePaymentPO.setCustomerName(materialOutsidePO.getCustomerName());
		materialOutsidePaymentPO.setReferMoney(materialOutsidePO.getProfit());
		
		materialOutsidePaymentPO.setPaymentType(MaterialOutsidePaymentPO.PAYMENTTYPE_COLLECT_INT);
		materialOutsidePaymentPO.setPaymentStatus(MaterialOutsidePaymentPO.PAYMENTSTATUS_INTI_INT);
		
		materialOutsidePaymentPO.setCreateUserId(userId);
		materialOutsidePaymentPO.setCreateUserName(userPO.getCurrentName());
		
		materialOutsidePaymentPO.setMaterialTypeName(materialOutsidePO.getMaterialType());
		materialOutsidePaymentPO.setMaterialBrandName(materialOutsidePO.getMaterialBrand());
		
		materialOutsideDao.save(materialOutsidePO);
		
		materialOutsidePaymentPO.setMoId(materialOutsidePO.getMoId());
		
		materialOutsidePaymentDao.save(materialOutsidePaymentPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialOutside(MaterialOutsideVO materialOutsideVO, String userId) throws FLException {
		
		long moId = materialOutsideVO.getMoId();
		
		MaterialOutsidePO materialOutsidePO = materialOutsideDao.get(moId);
		MaterialOutsidePaymentPO materialOutsidePaymentPO = materialOutsidePaymentDao.queryMaterialOutsidePaymentByMoId(moId);
		
		if(materialOutsidePO == null){
			throw new FLException(180012, "主材场外信息不存在");
		}
		
		if(materialOutsidePO.getStatus() != MaterialOutsidePO.STATUS_INIT_INT){
			throw new FLException(180013, "主材场外信息当前状态不能修改");
		}
		
		if(materialOutsidePaymentPO == null){
			throw new FLException(150020, "主材场外收款信息不存在");
		}
		
		if(materialOutsideVO.getSales() != null){
			materialOutsidePO.setSales(materialOutsideVO.getSales());
		}
		
		if(materialOutsideVO.getProfit() != null){
			materialOutsidePO.setProfit(materialOutsideVO.getProfit());
			materialOutsidePaymentPO.setReferMoney(materialOutsideVO.getProfit());
		}
		
		materialOutsideDao.update(materialOutsidePO);
		materialOutsidePaymentDao.update(materialOutsidePaymentPO);
	}

}
