/**
 * @File Name		: MaterialSubOrderBalanceServiceImpl.java
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
import com.fanglin.data.po.SupplierPO;
import com.fanglin.data.po.SupplierUserRightPO;
import com.fanglin.material.dao.MaterialSubOrderBalanceDao;
import com.fanglin.material.dao.MaterialSubOrderDao;
import com.fanglin.material.po.MaterialSubOrderBalancePO;
import com.fanglin.material.po.MaterialSubOrderPO;
import com.fanglin.material.service.MaterialSubOrderBalanceService;
import com.fanglin.material.vo.MaterialSubOrderBalanceVO;
import com.fanglin.material.vo.MaterialSubOrderVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialSubOrderBalanceService")
@Transactional(readOnly=true)
public class MaterialSubOrderBalanceServiceImpl implements MaterialSubOrderBalanceService {
	
	@Autowired
	private MaterialSubOrderBalanceDao materialSubOrderBalanceDao;
	
	@Autowired
	private MaterialSubOrderDao materialSubOrderDao;
	
	@Autowired
	private SupplierDao supplierDao;
	
	@Autowired
	private SupplierUserRightDao supplierUserRightDao;

	@Override
	public void pageMaterialSubOrderBalance(Paging paging, List<Filter> filters) {
		if(filters.size() == 0) return;
		List<MaterialSubOrderBalancePO> materialSubOrderBalancePOs = materialSubOrderBalanceDao.pageMaterialSubOrderBalance(paging, filters);
		List<MaterialSubOrderBalanceVO> materialSubOrderBalanceVOs = new ArrayList<MaterialSubOrderBalanceVO>();
		
		MaterialSubOrderBalanceVO materialSubOrderBalanceVO;
		
		for(MaterialSubOrderBalancePO materialSubOrderBalancePO: materialSubOrderBalancePOs){
			
			materialSubOrderBalanceVO = new MaterialSubOrderBalanceVO(new MaterialSubOrderVO(), new UserVO(), new UserVO(), new UserVO());
			
			BeanUtil.copyProperties(materialSubOrderBalancePO, materialSubOrderBalanceVO, "materialSubOrder", "creater", "instorer", "poster");
			BeanUtil.copyProperties(materialSubOrderBalancePO.getMaterialSubOrder(), materialSubOrderBalanceVO.getMaterialSubOrder());
			
			materialSubOrderBalanceVO.getCreater().setBaseInfo(materialSubOrderBalancePO.getCreater());
			materialSubOrderBalanceVO.getInstorer().setBaseInfo(materialSubOrderBalancePO.getInstorer());
			materialSubOrderBalanceVO.getPoster().setBaseInfo(materialSubOrderBalancePO.getPoster());
			
			materialSubOrderBalanceVOs.add(materialSubOrderBalanceVO);
		}
		
		paging.setData(materialSubOrderBalanceVOs);
	}

	@Override
	public void pageMaterialSubOrderBalanceForVender(Paging paging, List<Filter> filters, String userId) throws FLException {
		
		SupplierPO supplierPO = supplierDao.querySupplierByLoginId(userId);
		
		if (supplierPO == null) {
			throw new FLException(130008, "厂商不存在");
		}
		
		List<SupplierUserRightPO> supplierUserRightPOs = supplierUserRightDao.querySupplierUserRightBySId(supplierPO.getSid());
		List<String> userIds = new ArrayList<String>();
		
		for(SupplierUserRightPO supplierUserRightPO: supplierUserRightPOs){
			userIds.add(supplierUserRightPO.getUser().getUserId());
		}
		
		filters.add(new Filter(MaterialSubOrderBalancePO.COLUMN_USERID_STR, userIds, "in"));
		
		List<MaterialSubOrderBalancePO> materialSubOrderBalancePOs = materialSubOrderBalanceDao.pageMaterialSubOrderBalance(paging, filters);
		List<MaterialSubOrderBalanceVO> materialSubOrderBalanceVOs = new ArrayList<MaterialSubOrderBalanceVO>();
		
		MaterialSubOrderBalanceVO materialSubOrderBalanceVO;
		
		for(MaterialSubOrderBalancePO materialSubOrderBalancePO: materialSubOrderBalancePOs){
			
			materialSubOrderBalanceVO = new MaterialSubOrderBalanceVO(new MaterialSubOrderVO(), new UserVO(), new UserVO(), new UserVO());
			//将materialSubOrderBalanceVO的值赋值给materialSubOrderBalancePO，排除"materialSubOrder", "creater", "instorer", "poster"四个引用类型
			BeanUtil.copyProperties(materialSubOrderBalancePO, materialSubOrderBalanceVO, "materialSubOrder", "creater", "instorer", "poster");
			BeanUtil.copyProperties(materialSubOrderBalancePO.getMaterialSubOrder(), materialSubOrderBalanceVO.getMaterialSubOrder());
			
			materialSubOrderBalanceVO.getCreater().setBaseInfo(materialSubOrderBalancePO.getCreater());
			materialSubOrderBalanceVO.getInstorer().setBaseInfo(materialSubOrderBalancePO.getInstorer());
			materialSubOrderBalanceVO.getPoster().setBaseInfo(materialSubOrderBalancePO.getPoster());
			
			materialSubOrderBalanceVOs.add(materialSubOrderBalanceVO);
		}
		
		paging.setData(materialSubOrderBalanceVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderBalanceForVBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO) throws FLException {
		
		List<Short> status = Arrays.asList(MaterialSubOrderBalancePO.STATUS_VENDER_BALANCE_INT, MaterialSubOrderBalancePO.STATUS_FINISH_INT);
		
		MaterialSubOrderBalancePO materialSubOrderBalancePO = materialSubOrderBalanceDao.get(materialSubOrderBalanceVO.getMsobId());
		
		if(materialSubOrderBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(status.contains(materialSubOrderBalancePO.getStatus())){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		
		materialSubOrderBalancePO.setVbalance(materialSubOrderBalanceVO.getVbalance());
		
		materialSubOrderBalanceDao.update(materialSubOrderBalancePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void vpostMaterialSubOrderBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO) throws FLException {
		
		MaterialSubOrderBalancePO materialSubOrderBalancePO = materialSubOrderBalanceDao.get(materialSubOrderBalanceVO.getMsobId());
		
		if(materialSubOrderBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(materialSubOrderBalancePO.getStatus() != MaterialSubOrderBalancePO.STATUS_PRE_BALANCE_INT){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		
		materialSubOrderBalancePO.setVbalanceTime(DateUtil.getDateToTimestamp(new Date()));
		materialSubOrderBalancePO.setStatus(MaterialSubOrderBalancePO.STATUS_VENDER_BALANCE_INT);
		
		materialSubOrderBalanceDao.update(materialSubOrderBalancePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialSubOrderBalanceForBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO) throws FLException {
		
		MaterialSubOrderBalancePO materialSubOrderBalancePO = materialSubOrderBalanceDao.get(materialSubOrderBalanceVO.getMsobId());
		
		if(materialSubOrderBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(materialSubOrderBalancePO.getStatus() == MaterialSubOrderBalancePO.STATUS_FINISH_INT){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		//materialSubOrderBalancePO.setBalance(materialSubOrderBalanceVO.getBalance());
		//将balance的值赋值到post
		materialSubOrderBalancePO.setPost(materialSubOrderBalanceVO.getBalance());
		materialSubOrderBalanceDao.update(materialSubOrderBalancePO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void postMaterialSubOrderBalance(MaterialSubOrderBalanceVO materialSubOrderBalanceVO, String userId) throws FLException {

		MaterialSubOrderBalancePO materialSubOrderBalancePO = materialSubOrderBalanceDao.get(materialSubOrderBalanceVO.getMsobId());
		
		if(materialSubOrderBalancePO == null){
			throw new FLException(180018, "主材结算信息不存在");
		}
		
		if(materialSubOrderBalancePO.getStatus() != MaterialSubOrderBalancePO.STATUS_VENDER_BALANCE_INT){
			throw new FLException(180019, "主材结算信息状态错误 ");
		}
		
		materialSubOrderBalancePO.setPoster(new UserPO(userId));
		materialSubOrderBalancePO.setPostTime(DateUtil.getDateToTimestamp(new Date()));
		materialSubOrderBalancePO.setStatus(MaterialSubOrderBalancePO.STATUS_FINISH_INT);
		
		MaterialSubOrderPO materialSubOrderPO = materialSubOrderBalancePO.getMaterialSubOrder();
		
		materialSubOrderPO.setStatus(MaterialSubOrderPO.STATUS_TYPE_POSTBALANCE_INT);
		materialSubOrderPO.setBalanceStatus(MaterialSubOrderPO.BALANCE_STATUS_TYPE_POST_INT);
		materialSubOrderDao.update(materialSubOrderPO);
		materialSubOrderBalanceDao.update(materialSubOrderBalancePO);
	}

}
