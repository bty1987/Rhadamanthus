package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.payment.dao.ProxyPaymentDao;
import com.fanglin.payment.dao.ProxyReceiptDao;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.po.ProxyPaymentPO;
import com.fanglin.payment.po.ProxyReceiptPO;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.service.ProxyPaymentService;
import com.fanglin.payment.vo.ProxyPaymentVO;
import com.fanglin.payment.vo.ProxyReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("proxyPaymentService")
@Transactional(readOnly = true)
public class ProxyPaymentServiceImpl implements ProxyPaymentService {

	@Autowired
	private ProxyPaymentDao proxyPaymentDao;
	@Autowired
	private ProxyReceiptDao proxyReceiptDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private PaytranService paytranService;

	@Autowired
	private MessageService messageService;

	@Override
	public void pageProxyPayment(Paging paging, List<Filter> filters, ProxyPaymentVO proxyPayment, int company) {

		if (proxyPayment != null) proxyPayment.filter(filters);

		List<ProxyPaymentPO> proxyPaymentPOs = proxyPaymentDao.pageProxyPayment(paging, filters);
		List<ProxyPaymentVO> proxyPaymentVOs = new ArrayList<ProxyPaymentVO>();

		for (ProxyPaymentPO proxyPaymentPO : proxyPaymentPOs) {

			ProxyPaymentVO proxyPaymentVO = new ProxyPaymentVO(new ProxyReceiptVO(new UserBaseVO(), new UserBaseVO()), new UserBaseVO());

			proxyPaymentPOToVO(proxyPaymentPO, proxyPaymentVO);

			proxyPaymentVOs.add(proxyPaymentVO);
		}

		paging.setData(proxyPaymentVOs);

	}

	@Override
	public ProxyPaymentVO queryProxyPayment(ProxyPaymentVO proxyPayment) throws FLException {

		ProxyPaymentPO proxyPaymentPO = proxyPaymentDao.get(proxyPayment.getPpid());

		if (proxyPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		ProxyPaymentVO proxyPaymentVO = new ProxyPaymentVO(new ProxyReceiptVO(), new UserBaseVO());

		proxyPaymentPOToVO(proxyPaymentPO, proxyPaymentVO);

		return proxyPaymentVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addProxyPayment(ProxyPaymentVO proxyPaymentVO, String userId, int company) {

		ProxyPaymentPO proxyPaymentPO = new ProxyPaymentPO();

		BeanUtil.copyProperties(proxyPaymentVO, proxyPaymentPO, Arrays.asList("proxyReceipt", "creater"));

		if (userId == null) {
			userId = proxyPaymentVO.getCreater().getUserId();
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		proxyPaymentPO.setCreater(creater);
		proxyPaymentPO.setDid(creater.getDept().getDid());
		proxyPaymentPO.setRid(creater.getDept().getFatherDept().getDid());

		if (company == 0) {
			company = creater.getCompany();
		}

		proxyPaymentPO.setCompany(company);

		proxyPaymentDao.save(proxyPaymentPO);

		proxyPaymentVO.setPpid(proxyPaymentPO.getPpid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void collectProxyPayment(ProxyPaymentVO proxyPaymentVO, ProxyReceiptVO proxyReceiptVO, List<Long> ptids, String userId, int company) throws FLException {

		ProxyPaymentPO proxyPaymentPO = proxyPaymentDao.get(proxyPaymentVO.getPpid());

		if (proxyPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (proxyPaymentPO.getStatus() != ProxyPaymentPO.STATUS_INIT_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		ProxyReceiptPO proxyReceiptPO = new ProxyReceiptPO();

		Long cash = proxyReceiptVO.getCash();
		Long bank = proxyReceiptVO.getBank();
		Long checkv = proxyReceiptVO.getCheckv();

		long realMoney = 0;

		if (cash != null && cash != 0) {
			proxyReceiptPO.setCash(cash);
			proxyReceiptPO.setCashInfo(proxyReceiptVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}
		if (bank != null && bank != 0) {
			proxyReceiptPO.setBank(bank);
			proxyReceiptPO.setBankInfo(proxyReceiptVO.getBankInfo());
			realMoney = Arith.add(bank, realMoney);
		}
		if (checkv != null && checkv != 0) {
			proxyReceiptPO.setCheckv(checkv);
			proxyReceiptPO.setCheckvBank(proxyReceiptVO.getCheckvBank());
			realMoney = Arith.add(checkv, realMoney);
		}

		if (realMoney != proxyPaymentPO.getReferMoney()) {
			throw new FLException(150008, "款项不能进行收款");
		}

		UserPO userPO = userDao.queryUserByUserId(userId);

		proxyReceiptPO.setCollecter(userPO);
		proxyReceiptPO.setCollectTime(new Timestamp(System.currentTimeMillis()));
		proxyReceiptPO.setRealMoney(realMoney);
		proxyReceiptPO.setComment(proxyReceiptVO.getComment());

		proxyReceiptDao.save(proxyReceiptPO);

		proxyPaymentPO.setProxyReceipt(proxyReceiptPO);
		proxyPaymentPO.setStatus(ProxyPaymentPO.STATUS_PAY_INT);

		proxyPaymentDao.update(proxyPaymentPO);

		// 更新销售点信息
		if (ptids != null && ptids.size() > 0) {
			paytranService.updatePaytran(ptids, proxyReceiptPO.getPrid(), PaytranPO.STATUS_USED_INT, PaytranPO.TYPE_PROXY_INT);
		}

		messageService.sendMessage(proxyPaymentPO.getCreater().getUserId(), "", String.format("客户:%s,地址:%s,款项金额:%.3f,代付款完成收款", proxyPaymentPO.getName(), proxyPaymentPO.getAddress(), Arith.div(proxyPaymentPO.getReferMoney(), 1000.0)), MessagePO.TYPE_PAYMENT_INT, proxyPaymentPO.getCompany());

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void refundProxyPayment(ProxyPaymentVO proxyPayment, String userId, int company) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void confirmProxyPayment(List<Long> ppids, String userId) {

		List<ProxyPaymentPO> proxyPaymentPOs = proxyPaymentDao.queryProxyPaymentByPpids(ppids);

		for (ProxyPaymentPO proxyPaymentPO : proxyPaymentPOs) {

			if (proxyPaymentPO.getStatus() == ProxyPaymentPO.STATUS_PAY_INT) {

				ProxyReceiptPO proxyReceiptPO = proxyPaymentPO.getProxyReceipt();

				proxyPaymentPO.setStatus(ProxyPaymentPO.STATUS_CONFIRM_INT);

				UserPO user = userDao.queryUserByUserId(userId);
				proxyReceiptPO.setConfirmer(user);
				proxyReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));

				proxyReceiptDao.update(proxyReceiptPO);
				proxyPaymentDao.update(proxyPaymentPO);
			}
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelProxyPayment(ProxyPaymentVO proxyPaymentVO) throws FLException {

		ProxyPaymentPO proxyPaymentPO = proxyPaymentDao.get(proxyPaymentVO.getPpid());

		if (proxyPaymentPO == null) {
			throw new FLException(150003, "款项不存在");
		}

		if (proxyPaymentPO.getStatus() != ProxyPaymentPO.STATUS_INIT_INT) {
			throw new FLException(150036, "款项状态不可操作");
		}

		proxyPaymentPO.setStatus(ProxyPaymentPO.STATUS_CANCEL_INT);

		proxyPaymentDao.update(proxyPaymentPO);

	}

	public ProxyPaymentVO proxyPaymentPOToVO(ProxyPaymentPO proxyPaymentPO, ProxyPaymentVO proxyPaymentVO) {

		BeanUtil.copyProperties(proxyPaymentPO, proxyPaymentVO, Arrays.asList("proxyReceipt", "creater"));
		BeanUtil.copyProperties(proxyPaymentPO.getCreater(), proxyPaymentVO.getCreater(), Arrays.asList("role", "dept", "duty"));

		ProxyReceiptPO proxyReceiptPO = proxyPaymentPO.getProxyReceipt();

		if (proxyReceiptPO != null) {
			BeanUtil.copyProperties(proxyReceiptPO, proxyPaymentVO.getProxyReceipt(), Arrays.asList("collecter", "confirmer"));
			BeanUtil.copyProperties(proxyReceiptPO.getCollecter(), proxyPaymentVO.getProxyReceipt().getCollecter(), Arrays.asList("role", "dept", "duty"));
			BeanUtil.copyProperties(proxyReceiptPO.getConfirmer(), proxyPaymentVO.getProxyReceipt().getConfirmer(), Arrays.asList("role", "dept", "duty"));
		}

		return proxyPaymentVO;
	}

}
