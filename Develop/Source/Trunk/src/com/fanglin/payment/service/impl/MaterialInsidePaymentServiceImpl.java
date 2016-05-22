/**
 * @File Name		: MaterialInsidePaymentServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.payment.dao.MaterialInsidePaymentDao;
import com.fanglin.payment.po.MaterialInsidePaymentPO;
import com.fanglin.payment.service.MaterialInsidePaymentService;
import com.fanglin.payment.vo.MaterialInsidePaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialInsidePaymentService")
@Transactional(readOnly=true)
public class MaterialInsidePaymentServiceImpl implements MaterialInsidePaymentService {
	
	@Autowired
	private MaterialInsidePaymentDao materialInsidePaymentDao;
	
	@Autowired
	private UserDao userDao;
	
	@Override
	public void pageMaterialInside(Paging paging, List<FilterVO> filters){
		
		List<MaterialInsidePaymentPO> materialInsidePaymentPOs = materialInsidePaymentDao.pageMaterialInsidePayment(paging, filters);
		List<MaterialInsidePaymentVO> materialInsidePaymentVOs = new ArrayList<MaterialInsidePaymentVO>();
		
		for(MaterialInsidePaymentPO materialInsidePaymentPO: materialInsidePaymentPOs){
			MaterialInsidePaymentVO materialInsidePaymentVO = new MaterialInsidePaymentVO();
			BeanUtil.copyProperties(materialInsidePaymentPO, materialInsidePaymentVO);
			materialInsidePaymentVOs.add(materialInsidePaymentVO);
		}

		paging.setData(materialInsidePaymentVOs);
	}
	
	@Override
	public void pageMaterialInsidePaymentForInit(Paging paging, List<FilterVO> filters){
		
		List<MaterialInsidePaymentPO> materialInsidePaymentPOs = materialInsidePaymentDao.pageMaterialInsidePaymentByInit(paging, filters);
		List<MaterialInsidePaymentVO> materialInsidePaymentVOs = new ArrayList<MaterialInsidePaymentVO>();
		
		for(MaterialInsidePaymentPO materialInsidePaymentPO: materialInsidePaymentPOs){
			MaterialInsidePaymentVO materialInsidePaymentVO = new MaterialInsidePaymentVO();
			BeanUtil.copyProperties(materialInsidePaymentPO, materialInsidePaymentVO);
			materialInsidePaymentVOs.add(materialInsidePaymentVO);
		}
		
		paging.setData(materialInsidePaymentVOs);
	}

	@Override
	public void pageMaterialInsidePaymentForNotInit(Paging paging, List<FilterVO> filters){
		
		List<MaterialInsidePaymentPO> materialInsidePaymentPOs = materialInsidePaymentDao.pageMaterialInsidePaymentByNotInit(paging, filters);
		List<MaterialInsidePaymentVO> materialInsidePaymentVOs = new ArrayList<MaterialInsidePaymentVO>();
		
		for(MaterialInsidePaymentPO materialInsidePaymentPO: materialInsidePaymentPOs){
			MaterialInsidePaymentVO materialInsidePaymentVO = new MaterialInsidePaymentVO();
			BeanUtil.copyProperties(materialInsidePaymentPO, materialInsidePaymentVO);
			materialInsidePaymentVOs.add(materialInsidePaymentVO);
		}
		
		paging.setData(materialInsidePaymentVOs);
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialInsidePayment(MaterialInsidePaymentVO materialInsidePaymentVO, String userId){
		
		MaterialInsidePaymentPO materialInsidePaymentPO = materialInsidePaymentDao.get(materialInsidePaymentVO.getMipId());
		
		if(materialInsidePaymentPO != null && materialInsidePaymentPO.getPaymentStatus() == MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			
			if(materialInsidePaymentVO.getCash() != 0){
				materialInsidePaymentPO.setCash(materialInsidePaymentVO.getCash());
			}
			if(materialInsidePaymentVO.getBank() != 0){
				
				materialInsidePaymentPO.setBank(materialInsidePaymentVO.getBank());
				materialInsidePaymentPO.setBankName(materialInsidePaymentVO.getBankName());
			}
			if(materialInsidePaymentVO.getCheckv() != 0){
				materialInsidePaymentPO.setCheckv(materialInsidePaymentVO.getCheckv());
				materialInsidePaymentPO.setCheckvBankName(materialInsidePaymentVO.getCheckvBankName());
			}
			if(materialInsidePaymentVO.getInstallment() != 0){
				materialInsidePaymentPO.setInstallment(materialInsidePaymentVO.getInstallment());
				materialInsidePaymentPO.setInstallmentBankName(materialInsidePaymentVO.getInstallmentBankName());
			}
			if(materialInsidePaymentVO.getAccounts() != 0){
				materialInsidePaymentPO.setAccounts(materialInsidePaymentVO.getAccounts());
				materialInsidePaymentPO.setAccountsBankName(materialInsidePaymentVO.getAccountsBankName());
			}
			
			materialInsidePaymentPO.setPaymentStatus(MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);
			
			UserPO userPO = userDao.get(userId);
			materialInsidePaymentPO.setCollectUserId(userId);
			materialInsidePaymentPO.setCollectUserName(userPO.getCurrentName());
			materialInsidePaymentPO.setCollectTime(DateUtil.current(MaterialInsidePaymentPO.CURRENT_TIME_FORMAT_STR));
			
			materialInsidePaymentDao.update(materialInsidePaymentPO);
		}
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void confirmMaterialInsidePayment(List<Long> mipIds){
		
		for(Long mipId: mipIds){
			MaterialInsidePaymentPO materialInsidePaymentPO = materialInsidePaymentDao.get(mipId);
			
			if(materialInsidePaymentPO != null && materialInsidePaymentPO.getPaymentStatus() == MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT){
				
				if(materialInsidePaymentPO.getPaymentStatus() == MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT){
					materialInsidePaymentPO.setPaymentStatus(MaterialInsidePaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT);
					
					materialInsidePaymentDao.update(materialInsidePaymentPO);
				}
			}
		}
	}

}
