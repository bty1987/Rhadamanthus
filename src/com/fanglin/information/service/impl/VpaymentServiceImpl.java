package com.fanglin.information.service.impl;

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
import com.fanglin.information.dao.VpaymentDao;
import com.fanglin.information.dao.VreceiptDao;
import com.fanglin.information.dao.VticketDao;
import com.fanglin.information.po.VpaymentPO;
import com.fanglin.information.po.VreceiptPO;
import com.fanglin.information.po.VticketPO;
import com.fanglin.information.service.VpaymentService;
import com.fanglin.information.vo.VpaymentVO;
import com.fanglin.information.vo.VreceiptVO;
import com.fanglin.payment.dao.PointofsalesDao;
import com.fanglin.payment.po.PointofsalesPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vpaymentService")
@Transactional(readOnly = true)
public class VpaymentServiceImpl implements VpaymentService {

	@Autowired
	private VpaymentDao vpaymentDao;

	@Autowired
	private VticketDao vticketDao;

	@Autowired
	private VreceiptDao vreceiptDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private EmemberDao ememberDao;

	@Autowired
	private PointofsalesDao pointofsalesDao;

	@Override
	public void pageVpayment(Paging paging, List<Filter> filters, VpaymentVO vpaymentVO) {

		Short status = vpaymentVO == null ? null : vpaymentVO.getStatus();

		List<VpaymentPO> vpaymentPOs = vpaymentDao.pageVpayment(paging, filters, status);
		List<VpaymentVO> vpaymentVOs = new ArrayList<VpaymentVO>();

		for (VpaymentPO vpaymentPO : vpaymentPOs) {

			vpaymentVOs.add(VpaymentPOtoVO(vpaymentPO));
		}

		paging.setData(vpaymentVOs);
	}

	@Override
	public List<?> countVpayment() {

		List<?> countList = vpaymentDao.countVpayment();

		return countList;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int createVpayment(VpaymentVO vpaymentVO, String userId) throws FLException {

		VpaymentPO vpaymentPO = new VpaymentPO();

		UserPO createrPO = userDao.queryUserByUserId(userId);
		VticketPO vticketPO = vticketDao.queryVticketByTno(vpaymentVO.getMno());

		if (vticketPO == null) {
			throw new FLException(160026, "活动票不存在");
		}

		BeanUtil.copyProperties(vpaymentVO, vpaymentPO, Arrays.asList("creater", "vreceipt"));
		vpaymentPO.setCreater(createrPO);
		vpaymentPO.setCreateTime(new Timestamp(System.currentTimeMillis()));
		vpaymentPO.setVaid(vticketPO.getVaid());

		vpaymentDao.save(vpaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteVpaymentId(VpaymentVO vpaymentVO) {

		VpaymentPO vpaymentPO = vpaymentDao.get(vpaymentVO.getVpid());

		vpaymentDao.delete(vpaymentPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int collectVpayment(List<VpaymentVO> vpayments, VreceiptVO vreceiptVO, List<Long> posids, String userId) throws FLException {

		VreceiptPO vreceiptPO = new VreceiptPO();

		UserPO collectPO = userDao.queryUserByUserId(userId);
		vreceiptPO.setCollecter(collectPO);
		vreceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		vreceiptPO.setComment(vreceiptVO.getComment());

		if (vreceiptVO.getCash() != null) {
			vreceiptPO.setCash(vreceiptVO.getCash());
		} else {
			vreceiptPO.setCash(0);
		}

		if (vreceiptVO.getBank() != null) {
			vreceiptPO.setBank(vreceiptVO.getBank());
			vreceiptPO.setBankInfo(vreceiptVO.getBankInfo());
		} else {
			vreceiptPO.setBank(0);
			vreceiptPO.setBankInfo("");
		}

		if (vreceiptVO.getCoupon() != null) {
			vreceiptPO.setCoupon(vreceiptVO.getCoupon());
			vreceiptPO.setCouponInfo(vreceiptVO.getCouponInfo());
		} else {
			vreceiptPO.setCoupon(0);
			vreceiptPO.setCouponInfo("");
		}

		vreceiptDao.save(vreceiptPO);

		long referMoney = Arith.add(Arith.add(vreceiptPO.getCash(), vreceiptPO.getBank()), vreceiptPO.getCoupon());

		long realMoney = 0;

		String mno = null;

		for (VpaymentVO vpaymentVO : vpayments) {

			VpaymentPO vpaymentPO = vpaymentDao.get(vpaymentVO.getVpid());

			if (vpaymentPO == null) {
				throw new FLException(160033, "活动款不存在");
			}

			realMoney = Arith.add(realMoney, vpaymentPO.getMoney());

			if (mno == null) {
				mno = vpaymentPO.getMno();
			} else if (!vpaymentPO.getMno().equals(mno)) {
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

		for (VpaymentVO vpaymentVO : vpayments) {

			VpaymentPO vpaymentPO = vpaymentDao.get(vpaymentVO.getVpid());

			vpaymentPO.setStatus(VpaymentPO.STATUS_PAYED_INT);
			vpaymentPO.setVreceipt(vreceiptPO);

			vpaymentDao.update(vpaymentPO);
		}

		EmemberPO ememberPO = ememberDao.queryEmemberByNo(mno);

		if (posids != null && posids.size() > 0) {
			pointofsalesDao.updatePointofsales(posids, vreceiptPO.getVrid(), PointofsalesPO.STATUS_USED_INT,  PointofsalesPO.TYPE_ACTIVITY_INT);
		}

		if (ememberPO != null) {
			messageService.sendMessage(ememberPO.getUnionId(), "活动收款", mno, String.format("活动收款总额: %.3f", Arith.div(realMoney, 1000.0)));
		}

		return 0;
	}

	@Override
	public List<VpaymentVO> queryVpaymentByNo(VpaymentVO vpaymentVO) {

		List<VpaymentPO> VpaymentPOs = vpaymentDao.queryVpaymentByNo(vpaymentVO.getMno());
		List<VpaymentVO> vpayments = new ArrayList<VpaymentVO>();

		for (VpaymentPO vpaymentPO : VpaymentPOs) {
			vpaymentVO = new VpaymentVO(new UserBaseVO(), new UserBaseVO(), new VreceiptVO(new UserBaseVO()));

			BeanUtil.copyProperties(vpaymentPO, vpaymentVO, Arrays.asList("creater", "vreceipt"));
			BeanUtil.copyProperties(vpaymentPO.getCreater(), vpaymentVO.getCreater(), Arrays.asList("duty", "dept"));

			if (vpaymentPO.getVreceipt() != null) {

				BeanUtil.copyProperties(vpaymentPO.getVreceipt(), vpaymentVO, Arrays.asList("collecter"));
				BeanUtil.copyProperties(vpaymentPO.getVreceipt().getCollecter(), vpaymentVO.getCollecter(), Arrays.asList("dept", "duty"));
			}
			vpayments.add(vpaymentVO);

		}
		return vpayments;
	}

	@Override
	public List<VpaymentVO> queryVpaymentByVrid(VpaymentVO vpaymentVO) {

		List<VpaymentPO> VpaymentPOs = vpaymentDao.queryVpaymentByVrid(vpaymentVO.getVreceipt().getVrid());
		List<VpaymentVO> VpaymentVOs = new ArrayList<VpaymentVO>();

		for (VpaymentPO vpaymentPO : VpaymentPOs) {
			vpaymentVO = new VpaymentVO(new UserBaseVO(), new UserBaseVO(), new VreceiptVO(new UserBaseVO()));

			BeanUtil.copyProperties(vpaymentPO, vpaymentVO, Arrays.asList("creater", "vreceipt"));
			BeanUtil.copyProperties(vpaymentPO.getCreater(), vpaymentVO.getCreater(), Arrays.asList("duty", "dept"));

			if (vpaymentPO.getVreceipt() != null) {

				BeanUtil.copyProperties(vpaymentPO.getVreceipt(), vpaymentVO, Arrays.asList("collecter"));
				BeanUtil.copyProperties(vpaymentPO.getVreceipt().getCollecter(), vpaymentVO.getCollecter(), Arrays.asList("dept", "duty"));
			}
			VpaymentVOs.add(vpaymentVO);

		}

		return VpaymentVOs;
	}

	public VpaymentVO VpaymentPOtoVO(VpaymentPO vpaymentPO) {

		VpaymentVO vpaymentVO = new VpaymentVO(new UserBaseVO(), new UserBaseVO(), new VreceiptVO(new UserBaseVO()));

		BeanUtil.copyProperties(vpaymentPO, vpaymentVO, Arrays.asList("creater", "vreceipt"));
		BeanUtil.copyProperties(vpaymentPO.getCreater(), vpaymentVO.getCreater(), Arrays.asList("duty", "dept"));

		if (vpaymentPO.getVreceipt() != null) {

			BeanUtil.copyProperties(vpaymentPO.getVreceipt(), vpaymentVO, Arrays.asList("collecter"));
			BeanUtil.copyProperties(vpaymentPO.getVreceipt().getCollecter(), vpaymentVO.getCollecter(), Arrays.asList("dept", "duty"));
		}

		return vpaymentVO;
	}

}
