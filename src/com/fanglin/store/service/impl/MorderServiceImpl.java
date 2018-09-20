package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.store.dao.CartDao;
import com.fanglin.store.dao.CouponDao;
import com.fanglin.store.dao.MorderDao;
import com.fanglin.store.dao.MorderItemDao;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.dao.MuserDao;
import com.fanglin.store.po.CartPO;
import com.fanglin.store.po.CouponPO;
import com.fanglin.store.po.MorderItemPO;
import com.fanglin.store.po.MorderPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.po.MuserPO;
import com.fanglin.store.service.MorderService;
import com.fanglin.store.vo.CouponVO;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("morderService")
@Transactional(readOnly = true)
public class MorderServiceImpl implements MorderService {

	@Autowired
	private MorderDao morderDao;

	@Autowired
	private MorderItemDao morderItemDao;

	@Autowired
	private MuserDao muserDao;

	@Autowired
	private MpriceDao mpriceDao;

	@Autowired
	private CartDao cartDao;

	@Autowired
	private CouponDao couponDao;

	@Autowired
	private CountingService countingService;

	@Override
	public void pageMorder(Paging paging, List<Filter> filters, Boolean flag) {

		if (filters.size() == 0)
			return;

		List<MorderPO> morderPOs = morderDao.pageMorder(paging, filters);
		List<MorderVO> morderVOs = new ArrayList<MorderVO>();

		MorderVO morderVO;

		for (MorderPO morderPO : morderPOs) {

			morderVO = new MorderVO(new CouponVO());

			BeanUtil.copyProperties(morderPO, morderVO, Arrays.asList("coupon"));
			BeanUtil.copyProperties(morderPO.getCoupon(), morderVO.getCoupon(), Arrays.asList("mgoods"));

			if (flag == true) {

				List<MorderItemPO> morderItemPOs = morderItemDao.queryMorderItemByOid(morderPO.getOid());
				List<MorderItemVO> morderItemVOs = new ArrayList<MorderItemVO>();

				MorderItemVO morderItemVO;

				for (MorderItemPO morderItemPO : morderItemPOs) {

					morderItemVO = new MorderItemVO(new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO()));

					BeanUtil.copyProperties(morderItemPO, morderItemVO, Arrays.asList("mprice"));
					BeanUtil.copyProperties(morderItemPO.getMprice(), morderItemVO.getMprice(), Arrays.asList("mgoods", "mcolor", "mformat"));
					BeanUtil.copyProperties(morderItemPO.getMprice().getMgoods(), morderItemVO.getMprice().getMgoods(), Arrays.asList("mbrand"));
					BeanUtil.copyProperties(morderItemPO.getMprice().getMcolor(), morderItemVO.getMprice().getMcolor());
					BeanUtil.copyProperties(morderItemPO.getMprice().getMformat(), morderItemVO.getMprice().getMformat());

					morderItemVOs.add(morderItemVO);

				}

				morderVO.setItems(morderItemVOs);
			}

			morderVOs.add(morderVO);
		}

		paging.setData(morderVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMorder(MorderVO morderVO, List<MorderItemVO> morderItemVOs, List<Long> cids) throws FLException {

		String word = "S";

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_STORE_ORDER_INT, currentDate, 0);
		String endNo = FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		String no = String.valueOf(word) + currentDate + endNo;

		MuserPO muserPO = muserDao.queryMuserByUnionId(morderVO.getUnionId());

		if (muserPO == null) {
			throw new FLException(340009, "用户不存在");
		}

		MorderPO morderPO = new MorderPO();

		BeanUtil.copyProperties(morderVO, morderPO, Arrays.asList("coupon"));

		if (morderVO.getCoupon() != null) {
			morderPO.setCoupon(new CouponPO());
			CouponPO couponPO = couponDao.get(morderVO.getCoupon().getCid());
			BeanUtil.copyProperties(couponPO, morderPO.getCoupon(), Arrays.asList("mgoods"));
		}

		morderPO.setNo(no);
		morderPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		morderPO.setStatus(MorderPO.STATUS_INIT_SHORT);

		morderDao.save(morderPO);

		MorderItemPO morderItemPO;

		if (morderItemVOs != null && morderItemVOs.size() != 0) {

			float total = 0;

			for (MorderItemVO morderItemVO : morderItemVOs) {

				MpricePO mpricePO = mpriceDao.get(morderItemVO.getMprice().getPid());

				float price = mpricePO.getPrice();
				short num = morderItemVO.getNum();
				total += Arith.mul(price, num);

				morderItemPO = new MorderItemPO(mpricePO);

				BeanUtil.copyProperties(morderItemVO, morderItemPO, Arrays.asList("mprice"));
				morderItemPO.setOid(morderPO.getOid());

				morderItemDao.save(morderItemPO);

			}

			if (morderPO.getCoupon() != null) {

				if (morderPO.getCoupon().getType() == 1) {

					total = Arith.mul(total, morderPO.getCoupon().getValue());

				} else if (morderPO.getCoupon().getType() == 0) {

					total = Arith.sub(total, morderPO.getCoupon().getValue());

				}

			}

			morderPO.setTotal(total);

			morderDao.update(morderPO);

		}

		if (cids != null && cids.size() != 0) {

			for (Long cid : cids) {

				CartPO cartPO = cartDao.get(cid);

				cartDao.delete(cartPO);

			}

		}

		morderVO.setNo(morderPO.getNo());

		morderVO.setOid(morderPO.getOid());

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMorderForStatus(MorderVO morderVO) throws FLException {

		MorderPO morderPO = morderDao.get(morderVO.getOid());

		if (morderPO == null) {
			throw new FLException(340012, "订单不存在");
		}

		if (morderPO.getStatus() == MorderPO.STATUS_INIT_SHORT && morderVO.getStatus() == MorderPO.STATUS_WAITINGSEND_SHORT) {

			morderPO.setStatus(MorderPO.STATUS_WAITINGSEND_SHORT);

		} else if (morderPO.getStatus() == MorderPO.STATUS_WAITINGSEND_SHORT && morderVO.getStatus() == MorderPO.STATUS_ENDSEND_SHORT) {

			morderPO.setStatus(MorderPO.STATUS_ENDSEND_SHORT);

		} else if (morderPO.getStatus() == MorderPO.STATUS_ENDSEND_SHORT && morderVO.getStatus() == MorderPO.STATUS_WAITINGEVALUATION_SHORT) {

			morderPO.setStatus(MorderPO.STATUS_WAITINGEVALUATION_SHORT);

		} else if (morderVO.getStatus() == MorderPO.STATUS_COMPLETED_SHORT) {

			morderPO.setStatus(MorderPO.STATUS_COMPLETED_SHORT);

		} else {

			throw new FLException(340013, "订单状态不可操作");

		}

		morderDao.update(morderPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteMorder(MorderVO morderVO) throws FLException {

		MuserPO muserPO = muserDao.queryMuserByUnionId(morderVO.getUnionId());

		if (muserPO == null) {
			throw new FLException(340009, "用户不存在");
		}

		MorderPO morderPO = morderDao.get(morderVO.getOid());

		if (!morderPO.getUnionId().equals(morderVO.getUnionId())) {
			throw new FLException(340001, "无操作权限");
		}

		if (morderPO.getStatus() == MorderPO.STATUS_INIT_SHORT) {
			morderPO.setStatus(MorderPO.STATUS_DELETE_SHORT);
		} else {
			throw new FLException(340013, "订单状态不可操作");
		}

		morderDao.update(morderPO);

		return 0;
	}

}
