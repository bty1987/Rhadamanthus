package com.fanglin.inventory.service.impl;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.dao.PurchaseBalanceDao;
import com.fanglin.inventory.dao.PurchaseDao;
import com.fanglin.inventory.po.PurchaseBalancePO;
import com.fanglin.inventory.po.PurchasePO;
import com.fanglin.inventory.service.PurchaseBalanceService;

import com.fanglin.inventory.vo.PurchaseBalanceVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;



@Service("purchaseBalanceService")
@Transactional(readOnly = true)
public class PurchaseBalanceServiceImpl implements PurchaseBalanceService {

	@Autowired
	private PurchaseBalanceDao purchaseBalanceDao;
	
	@Autowired
	private UserDao userDao;
	
	@Autowired
	private PurchaseDao purchaseDao;
	
	@Override
	public List<PurchaseBalanceVO> queryPurchaseBalanceByPid(PurchaseBalanceVO purchaseBalanceVO) {
		
		List<PurchaseBalancePO> purchaseBalancePOs = purchaseBalanceDao.queryPurchaseBalanceByPid(purchaseBalanceVO.getPid());
		List<PurchaseBalanceVO> purchaseBalanceVOs = new ArrayList<PurchaseBalanceVO>();
		
		for (PurchaseBalancePO purchaseBalancePO : purchaseBalancePOs) {
			
			purchaseBalanceVO = new PurchaseBalanceVO(new UserBaseVO());
			
			BeanUtil.copyProperties(purchaseBalancePO, purchaseBalanceVO, Arrays.asList("creater"));
			
			if(purchaseBalancePO.getCreater() != null){
				purchaseBalanceVO.getCreater().setBaseInfo(purchaseBalancePO.getCreater());
			}
			
			purchaseBalanceVOs.add(purchaseBalanceVO);				
			
		}
		
		return purchaseBalanceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addPurchaseBalance(PurchaseBalanceVO purchaseBalanceVO, String userId)throws FLException {
		
		PurchasePO purchasePO = purchaseDao.queryPurchaseByPid(purchaseBalanceVO.getPid());
		
		if(purchasePO == null){
			throw new FLException(260017 ,"采购单不存在");
		}
		
		UserPO creater = userDao.queryUserByUserId(userId);
		
		PurchaseBalancePO purchaseBalancePO = new PurchaseBalancePO(new UserPO());
		
		BeanUtil.copyProperties(purchaseBalanceVO, purchaseBalancePO, Arrays.asList("creater"));
		purchaseBalancePO.setCreater(creater);
		purchaseBalancePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		
		purchaseBalanceDao.save(purchaseBalancePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchaseBalance(PurchaseBalanceVO purchaseBalanceVO)throws FLException {
		
		PurchaseBalancePO purchaseBalancePO = purchaseBalanceDao.get(purchaseBalanceVO.getPbid());
		
		if(purchaseBalancePO == null){
			throw new FLException(260039,"采购结算信息不存在");
		}
		
		short status = purchaseBalancePO.getStatus();
		
		if(status != 0){
			throw new FLException(260040,"采购结算状态不可操作");
		}
		
		purchaseBalancePO.setBalance(purchaseBalanceVO.getBalance());
		purchaseBalancePO.setComment(purchaseBalanceVO.getComment());
		
		purchaseBalanceDao.update(purchaseBalancePO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updatePurchaseBalanceForStatus(PurchaseBalanceVO purchaseBalanceVO) throws FLException {
		
		PurchaseBalancePO purchaseBalancePO = purchaseBalanceDao.get(purchaseBalanceVO.getPbid());
		
		if(purchaseBalancePO == null){
			throw new FLException(260039,"采购结算信息不存在");
		}
		
		PurchasePO purchasePO = purchaseDao.get(purchaseBalancePO.getPid());
		
		short status = purchaseBalancePO.getStatus();
		
		if(status != 0){
			throw new FLException(260040,"采购结算状态不可操作");
		}
		
		purchaseBalancePO.setStatus(PurchaseBalancePO.STATUS_DONE_INT);
		
		purchasePO.setBalanceStatus(PurchasePO.COLUMN_DONEBALANCESTATUS_STR);
		
		purchaseDao.update(purchasePO);
		purchaseBalanceDao.update(purchaseBalancePO);
		
		return 0;
	}

	
	

}
