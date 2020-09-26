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
import com.fanglin.store.dao.MuserCouponDao;
import com.fanglin.store.po.CouponPO;
import com.fanglin.store.po.MuserCouponPO;
import com.fanglin.store.service.MuserCouponService;
import com.fanglin.store.vo.CouponVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MuserCouponVO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("muserCouponService")
@Transactional(readOnly = true)
public class MuserCouponServiceImpl implements MuserCouponService {

	@Autowired
	private MuserCouponDao muserCouponDao;

	@Autowired
	private CouponDao couponDao;

	@Override
	public void pageMuserCoupon(Paging paging, List<Filter> filters) {

		List<MuserCouponPO> MuserCouponPOs = muserCouponDao.pageMuserCoupon(paging, filters);
		List<MuserCouponVO> MuserCouponVOs = new ArrayList<MuserCouponVO>();

		for (MuserCouponPO muserCouponPO : MuserCouponPOs) {

			MuserCouponVO muserCouponVO = new MuserCouponVO(new CouponVO(new MgoodsVO()));

			BeanUtil.copyProperties(muserCouponPO, muserCouponVO, Arrays.asList("coupon"));

			BeanUtil.copyProperties(muserCouponPO.getCoupon(), muserCouponVO.getCoupon(), Arrays.asList("mgoods"));

			BeanUtil.copyProperties(muserCouponPO.getCoupon().getMgoods(), muserCouponVO.getCoupon().getMgoods(), Arrays.asList("mbrand"));

			MuserCouponVOs.add(muserCouponVO);
		}

		paging.setData(MuserCouponVOs);
	}

	@Override
	public List<MuserCouponVO> queryMuserCouponByUnionId(MuserCouponVO muserCouponVO) {

		List<MuserCouponPO> muserCouponPOs = muserCouponDao.queryMuserCouponByUnionId(muserCouponVO.getUnionId());
		List<MuserCouponVO> muserCouponVOs = new ArrayList<MuserCouponVO>();

		MuserCouponVO muserCoupon;

		for (MuserCouponPO muserCouponPO : muserCouponPOs) {

			muserCoupon = new MuserCouponVO(new CouponVO(new MgoodsVO()));

			BeanUtil.copyProperties(muserCouponPO, muserCoupon, Arrays.asList("coupon"));
			BeanUtil.copyProperties(muserCouponPO.getCoupon(), muserCoupon.getCoupon(), Arrays.asList("mgoods"));
			BeanUtil.copyProperties(muserCouponPO.getCoupon().getMgoods(), muserCoupon.getCoupon().getMgoods(), Arrays.asList("mbrand"));

			muserCouponVOs.add(muserCoupon);
		}

		return muserCouponVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMuserCoupon(MuserCouponVO muserCouponVO) throws FLException {

		CouponPO couponPO = couponDao.get(muserCouponVO.getCoupon().getCid());

		MuserCouponPO muserCouponPO = new MuserCouponPO(couponPO);

		List<MuserCouponPO> muserCouponPOs = muserCouponDao.queryMuserCouponByUnionId(muserCouponVO.getUnionId());

		List<Long> cids = new ArrayList<Long>();

		for (MuserCouponPO muserCoupon : muserCouponPOs) {
			cids.add(muserCoupon.getCoupon().getCid());
		}

		if (cids.contains(muserCouponVO.getCoupon().getCid())) {
			throw new FLException(340016, "券已领取");
		}

		BeanUtil.copyProperties(muserCouponVO, muserCouponPO, Arrays.asList("coupon"));

		muserCouponDao.save(muserCouponPO);

		return 0;
	}

}
