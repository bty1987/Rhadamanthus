package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.EmemberDao;
import com.fanglin.customer.po.EmemberPO;
import com.fanglin.dingding.service.MessageService;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VticketPO;
import com.fanglin.payment.dao.ActivityPaymentDao;
import com.fanglin.payment.dao.ActivityReceiptDao;
import com.fanglin.payment.po.ActivityPaymentPO;
import com.fanglin.payment.po.ActivityReceiptPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.service.ActivityPaymentService;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.vo.ActivityPaymentVO;
import com.fanglin.payment.vo.ActivityReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("activityPaymentService")
@Transactional(readOnly = true)
public class ActivityPaymentServiceImpl implements ActivityPaymentService {

	@Autowired
	private ActivityPaymentDao activityPaymentDao;

	@Autowired
	private VticketDao vticketDao;

	@Autowired
	private ActivityReceiptDao activityReceiptDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private EmemberDao ememberDao;

	@Autowired
	private PaytranService paytranService;

	@Override
	public void pageActivityPayment(Paging paging, List<Filter> filters, ActivityPaymentVO activityPaymentVO) {

		Short status = activityPaymentVO == null ? null : activityPaymentVO.getStatus();

		List<ActivityPaymentPO> activityPaymentPOs = activityPaymentDao.pageActivityPayment(paging, filters, status);
		List<ActivityPaymentVO> activityPaymentVOs = new ArrayList<ActivityPaymentVO>();

		for (ActivityPaymentPO activityPaymentPO : activityPaymentPOs) {

			activityPaymentVOs.add(activityPaymentPOtoVO(activityPaymentPO));
		}

		paging.setData(activityPaymentVOs);
	}

	@Override
	public List<ActivityPaymentVO> queryActivityPaymentByNo(ActivityPaymentVO activityPaymentVO) {

		List<ActivityPaymentPO> activityPaymentPOs = activityPaymentDao.queryActivityPaymentByNo(activityPaymentVO.getMno());
		List<ActivityPaymentVO> activityPayments = new ArrayList<ActivityPaymentVO>();

		for (ActivityPaymentPO activityPaymentPO : activityPaymentPOs) {
			activityPayments.add(activityPaymentPOtoVO(activityPaymentPO));
		}
		return activityPayments;
	}

	@Override
	public List<ActivityPaymentVO> queryActivityPaymentByArid(ActivityPaymentVO activityPaymentVO) {

		List<ActivityPaymentPO> activityPaymentPOs = activityPaymentDao.queryActivityPaymentByArid(activityPaymentVO.getActivityReceipt().getArid());
		List<ActivityPaymentVO> activityPaymentVOs = new ArrayList<ActivityPaymentVO>();

		for (ActivityPaymentPO activityPaymentPO : activityPaymentPOs) {
			activityPaymentVOs.add(activityPaymentPOtoVO(activityPaymentPO));
		}

		return activityPaymentVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createActivityPayment(ActivityPaymentVO activityPaymentVO, String userId) throws FLException {

		ActivityPaymentPO activityPaymentPO = new ActivityPaymentPO();

		UserPO createrPO = userDao.queryUserByUserId(userId);
		VticketPO vticketPO = vticketDao.queryVticketByTno(activityPaymentVO.getMno());

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		BeanUtil.copyProperties(activityPaymentVO, activityPaymentPO, Arrays.asList("creater", "ActivityReceipt"));
		activityPaymentPO.setCreater(createrPO);
		activityPaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		activityPaymentPO.setVaid(vticketPO.getVaid());

		activityPaymentDao.save(activityPaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectActivityPayment(List<ActivityPaymentVO> activityPayments, ActivityReceiptVO activityReceiptVO, List<Long> ptids, String userId) throws FLException {

		ActivityReceiptPO activityReceiptPO = new ActivityReceiptPO();

		UserPO collectPO = userDao.queryUserByUserId(userId);
		activityReceiptPO.setCollecter(collectPO);
		activityReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		activityReceiptPO.setComment(activityReceiptVO.getComment());

		if (activityReceiptVO.getCash() != null) {
			activityReceiptPO.setCash(activityReceiptVO.getCash());
		} else {
			activityReceiptPO.setCash(0);
		}

		if (activityReceiptVO.getBank() != null) {
			activityReceiptPO.setBank(activityReceiptVO.getBank());
			activityReceiptPO.setBankInfo(activityReceiptVO.getBankInfo());
		} else {
			activityReceiptPO.setBank(0);
			activityReceiptPO.setBankInfo("");
		}

		if (activityReceiptVO.getCoupon() != null) {
			activityReceiptPO.setCoupon(activityReceiptVO.getCoupon());
			activityReceiptPO.setCouponInfo(activityReceiptVO.getCouponInfo());
		} else {
			activityReceiptPO.setCoupon(0);
			activityReceiptPO.setCouponInfo("");
		}

		activityReceiptDao.save(activityReceiptPO);

		long referMoney = Arith.add(Arith.add(activityReceiptPO.getCash(), activityReceiptPO.getBank()), activityReceiptPO.getCoupon());

		long realMoney = 0;

		String mno = null;

		for (ActivityPaymentVO activityPaymentVO : activityPayments) {

			ActivityPaymentPO activityPaymentPO = activityPaymentDao.get(activityPaymentVO.getApid());

			if (activityPaymentPO == null) {
				throw new FLException(160033, "活动款不存在");
			}

			realMoney = Arith.add(realMoney, activityPaymentPO.getMoney());

			if (mno == null) {
				mno = activityPaymentPO.getMno();
			} else if (!activityPaymentPO.getMno().equals(mno)) {
				throw new FLException(160035, "活动票号不符");
			}
		}

		VticketPO vticketPO = vticketDao.queryVticketByTno(mno);

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		if (vticketPO.getIscome() != VticketPO.ISCOME_YES_INT) {
			throw new FLException(160046, "活动票未到场");
		}

		if (Arith.sub(referMoney, realMoney) != 0) {
			throw new FLException(160034, "活动款金额不正确");
		}

		for (ActivityPaymentVO activityPaymentVO : activityPayments) {

			ActivityPaymentPO activityPaymentPO = activityPaymentDao.get(activityPaymentVO.getApid());

			activityPaymentPO.setStatus(ActivityPaymentPO.STATUS_PAYED_INT);
			activityPaymentPO.setActivityReceipt(activityReceiptPO);

			activityPaymentDao.update(activityPaymentPO);
		}

		EmemberPO ememberPO = ememberDao.queryEmemberByNo(mno);

		if (ptids != null && ptids.size() > 0) {
			paytranService.updatePaytran(ptids, activityReceiptPO.getArid(), PaytranPO.STATUS_USED_INT, PaytranPO.TYPE_ACTIVITY_INT);
		}

		if (ememberPO != null) {
			messageService.sendMessage(ememberPO.getUnionId(), "活动收款", mno, String.format("活动收款总额: %.3f", Arith.div(realMoney, 1000.0)));
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteActivityPaymentId(ActivityPaymentVO activityPaymentVO) {

		ActivityPaymentPO ActivityPaymentPO = activityPaymentDao.get(activityPaymentVO.getApid());

		activityPaymentDao.delete(ActivityPaymentPO);

		return 0;
	}

	@Override
	public List<List<String>> countActivityPayment() {

		List<List<String>> countList = activityPaymentDao.countActivityPayment();

		return countList;
	}

	public ActivityPaymentVO activityPaymentPOtoVO(ActivityPaymentPO activityPaymentPO) {

		ActivityPaymentVO activityPaymentVO = new ActivityPaymentVO(new UserBaseVO(), new UserBaseVO(), new ActivityReceiptVO(new UserBaseVO()));

		BeanUtil.copyProperties(activityPaymentPO, activityPaymentVO, Arrays.asList("creater", "activityReceipt"));
		BeanUtil.copyProperties(activityPaymentPO.getCreater(), activityPaymentVO.getCreater(), Arrays.asList("duty", "dept"));

		if (activityPaymentPO.getActivityReceipt() != null) {

			BeanUtil.copyProperties(activityPaymentPO.getActivityReceipt(), activityPaymentVO, Arrays.asList("collecter"));
			BeanUtil.copyProperties(activityPaymentPO.getActivityReceipt().getCollecter(), activityPaymentVO.getCollecter(), Arrays.asList("dept", "duty"));
		}

		return activityPaymentVO;
	}

}
