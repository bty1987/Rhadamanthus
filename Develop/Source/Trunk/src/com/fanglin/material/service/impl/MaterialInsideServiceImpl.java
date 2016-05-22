/**
 * @File Name		: MaterialInsideServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.dao.MaterialInsideDao;
import com.fanglin.material.po.MaterialInsidePO;
import com.fanglin.material.service.MaterialInsideService;
import com.fanglin.material.vo.MaterialInsideVO;
import com.fanglin.payment.dao.MaterialInsidePaymentDao;
import com.fanglin.payment.po.MaterialInsidePaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialInsideService")
@Transactional(readOnly=true)
public class MaterialInsideServiceImpl implements MaterialInsideService {
	
	@Autowired
	private MaterialInsideDao materialInsideDao;
	
	@Autowired
	private MaterialInsidePaymentDao materialInsidePaymentDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void pageMaterialInside(Paging paging, List<FilterVO> filters){
		
		List<MaterialInsidePO> materialInsidePOs = materialInsideDao.pageMaterialInside(paging, filters);
		List<MaterialInsideVO> materialInsideVOs = new ArrayList<MaterialInsideVO>();
		
		for(MaterialInsidePO materialInsidePO: materialInsidePOs){
			MaterialInsideVO materialInsideVO = new MaterialInsideVO();
			BeanUtil.copyProperties(materialInsidePO, materialInsideVO);
			materialInsideVOs.add(materialInsideVO);
		}
		
		paging.setData(materialInsideVOs);
	}

	@Override
	public void pageMaterialInsideByUserId(Paging paging, List<FilterVO> filters, String userId){
		
		filters.add(new FilterVO(MaterialInsidePO.COLUMN_MATERIALGUIDEID_STR, userId, "eq"));
		
		List<MaterialInsidePO> materialInsidePOs = materialInsideDao.pageMaterialInside(paging, filters);
		List<MaterialInsideVO> materialInsideVOs = new ArrayList<MaterialInsideVO>();
		
		for(MaterialInsidePO materialInsidePO: materialInsidePOs){
			MaterialInsideVO materialInsideVO = new MaterialInsideVO();
			BeanUtil.copyProperties(materialInsidePO, materialInsideVO);
			materialInsideVOs.add(materialInsideVO);
		}
		
		paging.setData(materialInsideVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMaterialInside(MaterialInsideVO materialInsideVO, String userId){
		
		MaterialInsidePO materialInsidePO = new MaterialInsidePO();
		BeanUtil.copyProperties(materialInsideVO, materialInsidePO);
		
		materialInsidePO.setCreateTime(DateUtil.current(MaterialInsidePO.CURRENT_TIME_FORMAT_STR));
		
		UserPO userPO = userDao.get(userId);
		
		if(userPO != null){
			materialInsidePO.setMaterialGuideId(userId);
			materialInsidePO.setMaterialGuideName(userPO.getCurrentName());
		}else{
			materialInsidePO.setMaterialGuideId("");
			materialInsidePO.setMaterialGuideName("");
		}
		
		MaterialInsidePaymentPO materialInsidePaymentPO = new MaterialInsidePaymentPO();
		
		materialInsidePaymentPO.setOrderAddr(materialInsidePO.getOrderAddr());
		
		materialInsidePaymentPO.setCustomerId(materialInsidePO.getCustomerId());
		materialInsidePaymentPO.setCustomerName(materialInsidePO.getCustomerName());
		
		materialInsidePaymentPO.setReferMoney(materialInsideVO.getSales());
		
		materialInsidePaymentPO.setCollectTime(DateUtil.current(MaterialInsidePaymentPO.CURRENT_TIME_FORMAT_STR));
		materialInsidePaymentPO.setConfirmTime(DateUtil.current(MaterialInsidePaymentPO.CURRENT_TIME_FORMAT_STR));
		
		materialInsidePaymentPO.setCreateUserId(userId);
		materialInsidePaymentPO.setCreateUserName(userPO.getCurrentName());
		
		materialInsidePaymentPO.setMaterialTypeName(materialInsidePO.getMaterialType());
		materialInsidePaymentPO.setMaterialBrandName(materialInsidePO.getMaterialBrand());
		
		materialInsidePaymentPO.setCollectUserId("");
		materialInsidePaymentPO.setCollectUserName("");
		materialInsidePaymentPO.setConfirmUserId("");
		materialInsidePaymentPO.setConfirmUserName("");
		
		materialInsidePaymentPO.setBankName("");
		materialInsidePaymentPO.setCheckvBankName("");
		materialInsidePaymentPO.setInstallmentBankName("");
		materialInsidePaymentPO.setAccountsBankName("");
		
		materialInsidePaymentPO.setDes("");
		
		materialInsideDao.saveOrUpdate(materialInsidePO);
		
		materialInsidePaymentPO.setMiId(materialInsidePO.getMiId());
		
		materialInsidePaymentDao.saveOrUpdate(materialInsidePaymentPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateMaterialInside(MaterialInsideVO materialInsideVO, String userId) {
		
		MaterialInsidePO materialInsidePO = materialInsideDao.get(materialInsideVO.getMiId());
		
		if(materialInsidePO != null){
			UserPO userPO = userDao.get(userId);
			
			if(userPO != null){
				materialInsidePO.setMaterialGuideId(userId);
				materialInsidePO.setMaterialGuideName(userPO.getCurrentName());
			}else{
				materialInsidePO.setMaterialGuideId("");
				materialInsidePO.setMaterialGuideName("");
			}
			
			materialInsideDao.update(materialInsidePO);
		}
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteMaterialInsideByMiIds(List<Integer> miIds){
		
		for(Integer miId: miIds){
			MaterialInsidePaymentPO materialInsidePaymentPO = materialInsidePaymentDao.get(miId);
			
			if(materialInsidePaymentPO != null){
				if(materialInsidePaymentPO.getPaymentStatus() == MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
					materialInsidePaymentDao.delete(materialInsidePaymentPO);
				}
			}
		}
	}

}
