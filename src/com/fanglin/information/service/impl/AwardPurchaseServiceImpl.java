package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardPurchaseDao;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardPurchasePO;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.information.service.AwardPurchaseService;
import com.fanglin.information.vo.AwardPurchaseVO;
import com.fanglin.information.vo.AwardStockVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("awardPurchaseService")
@Transactional(readOnly = true)
public class AwardPurchaseServiceImpl implements AwardPurchaseService {

	@Autowired
	private AwardPurchaseDao awardPurchaseDao;

	@Autowired
	private UserDao userdDao;
	
	@Autowired
	private AwardStockDao awardStockDao;
	
	@Autowired
	private AwardRecordDao awardRecordDao;

	@Override
	public void pageAwardPurchase(Paging paging, List<Filter> filters, AwardPurchaseVO awardPurchase, int company) {

		List<AwardPurchasePO> awardPurchasePOs = awardPurchaseDao.pageAwardPurchase(paging, filters, company);
		List<AwardPurchaseVO> awardPurchaseVOs = new ArrayList<AwardPurchaseVO>();

		for (AwardPurchasePO awardPurchasePO : awardPurchasePOs) {

			AwardPurchaseVO awardPurchaseVO = new AwardPurchaseVO(new AwardStockVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			
			BeanUtil.copyProperties(awardPurchasePO, awardPurchaseVO, Arrays.asList( "awardStock","creater", "purchaser", "instorer"));
			BeanUtil.copyPropertie(awardPurchasePO.getAwardStock(), awardPurchaseVO.getAwardStock());
			BeanUtil.copyProperties(awardPurchasePO.getCreater(), awardPurchaseVO.getCreater(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(awardPurchasePO.getPurchaser(), awardPurchaseVO.getPurchaser(), Arrays.asList("dept", "role", "duty"));
			BeanUtil.copyProperties(awardPurchasePO.getInstorer(), awardPurchaseVO.getInstorer(), Arrays.asList("dept", "role", "duty"));
			awardPurchaseVOs.add(awardPurchaseVO);
		}

		paging.setData(awardPurchaseVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAwardPurchase(AwardPurchaseVO awardPurchaseVO, String userId, int company) throws FLException {
		
		UserPO creater = userdDao.queryUserByUserId(userId);
		
		AwardStockPO awardStock = awardStockDao.get(awardPurchaseVO.getAwardStock().getAsId());
		
		AwardPurchasePO awardPurchasePO = new AwardPurchasePO(null, creater, null, null);
		
		BeanUtil.copyProperties(awardPurchaseVO, awardPurchasePO, Arrays.asList( "awardStock","creater", "purchaser", "instorer"));
		
		
		awardPurchasePO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_INIT_INT);
		awardPurchasePO.setCompany(company);
		awardPurchasePO.setAwardStock(awardStock);
		awardPurchaseDao.save(awardPurchasePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void purchaseAwardPurchase(AwardPurchaseVO awardPurchase, String userId) throws FLException {
		
		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchase.getApId());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_INIT_INT) {
			throw new FLException(160058, "奖品采购不可操作");
		}
		
		UserPO purchaser  = userdDao.queryUserByUserId(userId);

		awardPurchasePO.setPurchaser(purchaser);
		awardPurchasePO.setInprice(awardPurchase.getInprice());
		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_PROC_INT);
		awardPurchasePO.setPurchaseTime(DateUtil.getDateToTimestamp(new Date()));

		awardPurchaseDao.update(awardPurchasePO);
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void instoreAwardPurchase(AwardPurchaseVO awardPurchase, String userId) throws FLException {
		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchase.getApId());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_PROC_INT) { 
			throw new FLException(160058, "奖品采购不可操作");
		}

		AwardStockPO awardStockPO = awardStockDao.get(awardPurchasePO.getAwardStock().getAsId());
		
		UserPO instorer  = userdDao.queryUserByUserId(userId);
		
		if(awardStockPO.getIsStock() == AwardStockPO.ISSTOCK_CAL_INT){
			awardStockPO.setNum(Arith.add(awardPurchasePO.getAwardStock().getNum(), awardPurchasePO.getNum()));
			awardStockDao.update(awardStockPO);

			AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, instorer, null, AwardRecordPO.TYPE_CG_INT, awardStockPO.getSubtype(), awardStockPO.getStoreroom(), AwardStockPO.ISSTOCK_CAL_INT, ((int)awardPurchasePO.getInprice()), awardPurchasePO.getNum(), null);

			awardRecordDao.save(awardRecordPO);
			
		}
		
		awardPurchasePO.setInstorer(instorer);
		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_WARE_INT);
		awardPurchasePO.setInstoreTime(DateUtil.getDateToTimestamp(new Date()));

		awardPurchaseDao.update(awardPurchasePO);
		
	} 

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void balanceAwardPurchase(AwardPurchaseVO awardPurchase, String userId) throws FLException {
		AwardPurchasePO awardPurchasePO = awardPurchaseDao.get(awardPurchase.getApId());

		if (awardPurchasePO == null) {
			throw new FLException(160057, "奖品采购不存在");
		}

		if (awardPurchasePO.getStatus() != AwardPurchasePO.STATUS_WARE_INT) { 
			throw new FLException(160058, "奖品采购不可操作");
		}
		
		awardPurchasePO.setBaprice(awardPurchase.getBaprice());
		awardPurchasePO.setStatus(AwardPurchasePO.STATUS_CLOSE_INT);
		awardPurchasePO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

		awardPurchaseDao.update(awardPurchasePO);
		
	}
	
}
