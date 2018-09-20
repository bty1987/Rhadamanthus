package com.fanglin.store.service.impl;

import java.util.Arrays;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MorderDao;
import com.fanglin.store.dao.MpaymentDao;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.MorderPO;
import com.fanglin.store.po.MpaymentPO;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.MpaymentService;
import com.fanglin.store.vo.MpaymentVO;
import com.fanglin.store.vo.MuserVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("MpaymentService")
@Transactional(readOnly=true)
public class MpaymentServiceImpl implements MpaymentService{

	@Autowired
	private MpaymentDao mpaymentDao;
	
	@Autowired
	private MorderDao morderDao;
	
	@Autowired
	private MuserDao muserDao;
	
	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addMpayment(MpaymentVO mpaymentVO, MuserVO muserVO) throws FLException{
		
		MorderPO morderPO = morderDao.get(mpaymentVO.getMorder().getOid());
		
		MuserPO muserPO = muserDao.queryMuserByUnionId(muserVO.getUnionId());
		
		if(muserPO == null){
			throw new FLException(340009, "用户不存在");
		}
		
		if(morderPO == null){
			throw new FLException(340012, "订单不存在");
		}
		
		if(!muserVO.getUnionId().equals(morderPO.getUnionId())){
			throw new FLException(340001, "无操作权限");
		}
		
		MpaymentPO mpaymentPO = new MpaymentPO(morderPO);
		
		BeanUtil.copyProperties(mpaymentVO, mpaymentPO, Arrays.asList("morder"));
		BeanUtil.copyProperties(mpaymentVO.getMorder(), mpaymentPO.getMorder(), Arrays.asList("coupon"));
		mpaymentPO.setTotalPrice(mpaymentPO.getMorder().getTotal());
		mpaymentPO.setStatus(MpaymentPO.STATUS_PAYMENT_SHORT);
		
		mpaymentDao.save(mpaymentPO);
		
		morderPO.setStatus(MorderPO.STATUS_WAITINGSEND_SHORT);
		morderPO.setPaymentTime(DateUtil.getDateToTimestamp(new Date()));
		
		morderDao.update(morderPO);
		
	}

}
