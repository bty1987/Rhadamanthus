/**
 * @File Name		: MaterialOutsidePaymentServiceImpl.java
 * @Package   	: com.fanglin.material.service.impl
 * @Version		: 1.0
 * @Date			: 2015-10-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.dao.MaterialOutsideDao;
import com.fanglin.material.po.MaterialOutsidePO;
import com.fanglin.payment.dao.MaterialOutsidePaymentDao;
import com.fanglin.payment.dao.MaterialOutsideReceiptDao;
import com.fanglin.payment.po.MaterialOutsidePaymentPO;
import com.fanglin.payment.po.MaterialOutsideReceiptPO;
import com.fanglin.payment.service.MaterialOutsidePaymentService;
import com.fanglin.payment.vo.MaterialOutsidePaymentVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialOutsidePaymentService")
@Transactional(readOnly=true)
public class MaterialOutsidePaymentServiceImpl implements MaterialOutsidePaymentService {
	
	@Autowired
	private MaterialOutsidePaymentDao materialOutsidePaymentDao;
	
	@Autowired
	private MaterialOutsideReceiptDao materialOutsideReceiptDao;
	
	@Autowired
	private MaterialOutsideDao materialOutsideDao;

	@Override
	public void pageMaterialOutsidePayment(Paging paging, List<Filter> filters) {
		
		List<MaterialOutsidePaymentPO> materialOutsidePaymentPOs = materialOutsidePaymentDao.pageMaterialOutsidePayment(paging, filters);
		List<MaterialOutsidePaymentVO> materialOutsidePaymentVOs = new ArrayList<MaterialOutsidePaymentVO>();
		
		for(MaterialOutsidePaymentPO materialOutsidePaymentPO: materialOutsidePaymentPOs){
			MaterialOutsidePaymentVO materialOutsidePaymentVO = new MaterialOutsidePaymentVO();
			BeanUtil.copyProperties(materialOutsidePaymentPO, materialOutsidePaymentVO);
			
			MaterialOutsideReceiptPO materialOutsideReceiptPO = materialOutsidePaymentPO.getMaterialOutsideReceipt();
			
			if(materialOutsideReceiptPO != null){
				BeanUtil.copyProperties(materialOutsideReceiptPO, materialOutsidePaymentVO);
			}
			
			materialOutsidePaymentVOs.add(materialOutsidePaymentVO);
		}
		
		paging.setData(materialOutsidePaymentVOs);
	}

	@Override
	public void pageMaterialOutsidePaymentForInit(Paging paging, List<Filter> filters) {
		
		if(filters.size() == 0) return;
		
		List<MaterialOutsidePaymentPO> materialOutsidePaymentPOs = materialOutsidePaymentDao.pageMaterialOutsidePaymentByInit(paging, filters);
		List<MaterialOutsidePaymentVO> materialOutsidePaymentVOs = new ArrayList<MaterialOutsidePaymentVO>();
		
		for(MaterialOutsidePaymentPO materialOutsidePaymentPO: materialOutsidePaymentPOs){
			MaterialOutsidePaymentVO materialOutsidePaymentVO = new MaterialOutsidePaymentVO();
			BeanUtil.copyProperties(materialOutsidePaymentPO, materialOutsidePaymentVO);
			
			MaterialOutsideReceiptPO materialOutsideReceiptPO = materialOutsidePaymentPO.getMaterialOutsideReceipt();

			if(materialOutsideReceiptPO != null){
				BeanUtil.copyProperties(materialOutsideReceiptPO, materialOutsidePaymentVO);
			}
			
			materialOutsidePaymentVOs.add(materialOutsidePaymentVO);
		}
		
		paging.setData(materialOutsidePaymentVOs);
	}

	@Override
	public void pageMaterialOutsidePaymentForNotInit(Paging paging, List<Filter> filters) {
		
		if(filters.size() == 0) return;
		
		List<MaterialOutsidePaymentPO> materialOutsidePaymentPOs = materialOutsidePaymentDao.pageMaterialOutsidePaymentByNotInit(paging, filters);
		List<MaterialOutsidePaymentVO> materialOutsidePaymentVOs = new ArrayList<MaterialOutsidePaymentVO>();
		
		for(MaterialOutsidePaymentPO materialOutsidePaymentPO: materialOutsidePaymentPOs){
			MaterialOutsidePaymentVO materialOutsidePaymentVO = new MaterialOutsidePaymentVO();
			BeanUtil.copyProperties(materialOutsidePaymentPO, materialOutsidePaymentVO);
			
			MaterialOutsideReceiptPO materialOutsideReceiptPO = materialOutsidePaymentPO.getMaterialOutsideReceipt();

			if(materialOutsideReceiptPO != null){
				BeanUtil.copyProperties(materialOutsideReceiptPO, materialOutsidePaymentVO);
			}
			
			materialOutsidePaymentVOs.add(materialOutsidePaymentVO);
		}
		
		paging.setData(materialOutsidePaymentVOs);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialOutsidePayment(MaterialOutsidePaymentVO materialOutsidePaymentVO, String userId, String userName) throws FLException {
		
		MaterialOutsidePaymentPO materialOutsidePaymentPO = materialOutsidePaymentDao.get(materialOutsidePaymentVO.getMopId());
		
		if(materialOutsidePaymentPO == null){
			throw new FLException(150020, "主材场外收款信息不存在");
		}
		
		MaterialOutsideReceiptPO materialOutsideReceiptPO = new MaterialOutsideReceiptPO();
		
		MaterialOutsidePO materialOutsidePO = materialOutsideDao.get(materialOutsidePaymentPO.getMoId());
		
		if(materialOutsidePO == null){
			throw new FLException(180012, "主材场外信息不存在");
		}
		
		if(materialOutsidePaymentPO.getPaymentStatus() != MaterialOutsidePaymentPO.PAYMENTSTATUS_INTI_INT){
			throw new FLException(150021, "主材场外当前状态不能收款");
		}
		
		if(materialOutsidePaymentVO.getCash() != null){
			materialOutsideReceiptPO.setCash(materialOutsidePaymentVO.getCash());
			materialOutsideReceiptPO.setCashInfo(materialOutsidePaymentVO.getCashInfo());
		}
		
		if(materialOutsidePaymentVO.getBank() != null){
			materialOutsideReceiptPO.setBank(materialOutsidePaymentVO.getBank());
			materialOutsideReceiptPO.setBankName(materialOutsidePaymentVO.getBankName());
		}
		
		if(materialOutsidePaymentVO.getCheckv() != null){
			materialOutsideReceiptPO.setCheckv(materialOutsidePaymentVO.getCheckv());
			materialOutsideReceiptPO.setCheckvBankName(materialOutsidePaymentVO.getCheckvBankName());
		}
		
		if(materialOutsidePaymentVO.getInstallment() != null){
			materialOutsideReceiptPO.setInstallment(materialOutsidePaymentVO.getInstallment());
			materialOutsideReceiptPO.setInstallmentBankName(materialOutsidePaymentVO.getInstallmentBankName());
		}
		
		if(materialOutsidePaymentVO.getAccounts() != null){
			materialOutsideReceiptPO.setAccounts(materialOutsidePaymentVO.getAccounts());
			materialOutsideReceiptPO.setAccountsBankName(materialOutsidePaymentVO.getAccountsBankName());
		}
		
		materialOutsidePaymentPO.setPaymentStatus(MaterialOutsidePaymentPO.PAYMENTSTATUS_COLLECT_INT);
		materialOutsidePaymentPO.setMaterialOutsideReceipt(materialOutsideReceiptPO);
		
		materialOutsideReceiptPO.setCollectUserId(userId);
		materialOutsideReceiptPO.setCollectUserName(userName);
		materialOutsideReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		
		materialOutsidePaymentPO.setMaterialOutsideReceipt(materialOutsideReceiptPO);
		
		materialOutsideReceiptDao.save(materialOutsideReceiptPO);
		materialOutsidePaymentDao.update(materialOutsidePaymentPO);
		
		materialOutsidePO.setStatus(MaterialOutsidePO.STATUS_COLLECT_INT);
		
		materialOutsideDao.update(materialOutsidePO);
		
		return 0;
	}

}
