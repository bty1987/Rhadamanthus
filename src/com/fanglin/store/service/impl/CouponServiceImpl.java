package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.CouponDao;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.dao.MuserCouponDao;
import com.fanglin.store.po.CouponPO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.service.CouponService;
import com.fanglin.store.vo.CouponVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("couponService")
@Transactional(readOnly=true)
public class CouponServiceImpl implements CouponService{
	
	@Autowired
	private CouponDao couponDao;
	
	@Autowired
	private MuserCouponDao muserCouponDao;
	
	@Autowired
	private MgoodsDao mgoodsDao;

	@Override
	public void pageCoupon(Paging paging, List<Filter> filters) {
		
		List<CouponPO> CouponPOs = couponDao.pageCoupon(paging, filters);
		List<CouponVO> CouponVOs = new ArrayList<CouponVO>();
		
		for (CouponPO couponPO : CouponPOs) {
			
			CouponVO couponVO = new CouponVO(new MgoodsVO());
			
			BeanUtil.copyProperties(couponPO, couponVO, Arrays.asList("mgoods"));
			
			BeanUtil.copyProperties(couponPO.getMgoods(), couponVO.getMgoods(), Arrays.asList("mbrand"));
			
			CouponVOs.add(couponVO);
		}
		
		paging.setData(CouponVOs);
	}
	
	@Override
	public CouponVO queryCouponByCid(CouponVO couponVO) {
		
		CouponPO couponPO = couponDao.get(couponVO.getCid());	
		
		CouponVO coupon = new CouponVO(new MgoodsVO());
		
		BeanUtil.copyProperties(couponPO, coupon, Arrays.asList("mgoods"));
		
		BeanUtil.copyProperties(couponPO.getMgoods(), coupon.getMgoods(), Arrays.asList("mbrand"));	
		
		return coupon;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addCoupon(CouponVO couponVO) throws FLException {

		MgoodsPO mgoodsPO = mgoodsDao.get(couponVO.getMgoods().getGid());
		
		CouponPO couponPO = new CouponPO(mgoodsPO);
		
		BeanUtil.copyProperties(couponVO, couponPO, Arrays.asList("mgoods"));
		
		couponDao.save(couponPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCoupon(CouponVO couponVO) {
		
		CouponPO couponPO = couponDao.get(couponVO.getCid());
		
		BeanUtil.copyProperties(couponVO, couponPO, Arrays.asList("mgoods"));
		
		couponDao.update(couponPO);	
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateCouponForStatus(CouponVO couponVO) {
		
		CouponPO couponPO = couponDao.get(couponVO.getCid());
		
		if(couponVO.getStatus() == CouponPO.STATUS_DISABLE_SHORT){
		
			couponPO.setStatus(couponVO.getStatus());
			
			muserCouponDao.updateMuserCouponByCid(couponVO.getCid());
			
		}if(couponVO.getStatus() == CouponPO.STATUS_ABLE_SHORT){
			
			couponPO.setStatus(couponVO.getStatus());
			
		}
		
		couponDao.update(couponPO);
		
	}

}
