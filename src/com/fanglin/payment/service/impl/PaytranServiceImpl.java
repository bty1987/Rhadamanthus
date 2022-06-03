package com.fanglin.payment.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.dao.PaytranDao;
import com.fanglin.payment.dao.ServicePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.po.PaytranPO;
import com.fanglin.payment.po.ServicePaymentPO;
import com.fanglin.payment.service.DecorationPaymentService;
import com.fanglin.payment.service.PaymentService;
import com.fanglin.payment.service.PaytranService;
import com.fanglin.payment.service.SalesPaymentService;
import com.fanglin.payment.service.ServicePaymentService;
import com.fanglin.payment.vo.DecorationPaymentVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.payment.vo.PaytranVO;
import com.fanglin.payment.vo.SalesPaymentVO;
import com.fanglin.payment.vo.SalesReceiptVO;
import com.fanglin.payment.vo.ServicePaymentVO;
import com.fanglin.payment.vo.ServiceReceiptVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("paytranService")
@Transactional(readOnly = true)
public class PaytranServiceImpl implements PaytranService {

	@Autowired
	private PaytranDao paytranDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private PaymentDao paymentDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private ServicePaymentDao servicePaymentDao;

	@Autowired
	private PaymentService paymentService;

	@Autowired
	private DecorationPaymentService decorationPaymentService;

	@Autowired
	private SalesPaymentService salesPaymentService;

	@Autowired
	private ServicePaymentService servicePaymentService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pagePaytran(Paging paging, List<Filter> filters) {

		List<PaytranPO> paytranPOs = paytranDao.pagePaytran(paging, filters);
		List<PaytranVO> paytranVOs = new ArrayList<PaytranVO>();

		for (PaytranPO paytranPO : paytranPOs) {

			PaytranVO paytranVO = new PaytranVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			BeanUtil.copyProperties(paytranPO, paytranVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(paytranPO.getCreater(), paytranVO.getCreater(), Arrays.asList("role", "dept", "duty"));

			paytranVOs.add(paytranVO);
		}

		paging.setData(paytranVOs);
	}

	@Override
	public List<PaytranVO> queryPaytran(PaytranVO paytran) {

		List<PaytranPO> paytranPOs = paytranDao.queryPaytran(paytran.getOrderId(), paytran.getType(), paytran.getRid(), paytran.getPid());
		List<PaytranVO> paytranVOs = new ArrayList<PaytranVO>();

		for (PaytranPO paytranPO : paytranPOs) {

			PaytranVO paytranVO = new PaytranVO(new UserVO(new RoleVO(), new DepartmentVO(), new DutyVO()));

			BeanUtil.copyProperties(paytranPO, paytranVO, Arrays.asList("creater"));
			BeanUtil.copyProperties(paytranPO.getCreater(), paytranVO.getCreater(), Arrays.asList("role", "dept", "duty"));

			paytranVOs.add(paytranVO);
		}

		return paytranVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPaytran(PaytranVO paytranVO, String userId, int company) throws FLException {

		if (Arith.div(paytranVO.getMoney(), 1000.0) == 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		if (paytranDao.countPaytran(paytranVO.getSn(), PaytranPO.STATUS_INIT_INT) != 0) {
			throw new FLException(150048, "转换款支付未完成");
		}

		PaytranPO paytranPO = new PaytranPO();

		UserPO creater = userDao.queryUserByUserId(userId);

		// 小程序支付端:会生成pid和orderId 信息平台:pid=0, 只会生成orderId (不能乱, pid是否>0会用于判断)
		BeanUtil.copyProperties(paytranVO, paytranPO, Arrays.asList("creater"));

		paytranPO.setStatus(PaytranPO.STATUS_INIT_INT);
		paytranPO.setCreater(creater);

		paytranDao.save(paytranPO); // 国通的pos推送需要第三方账号, 第三方账号组成有ptid

		String currentDate = DateUtil.current("yyyyMMdd").toString();
		String ident = FormatUtil.fillZero(new Random().nextInt(9999), "0000");

		String orderNo = String.format("%s%s%s", currentDate, paytranPO.getPtid(), ident);

		paytranPO.setOutOrderNo(orderNo);

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("pospay", String.class, PaytranPO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("pospay", String.class, PaytranPO.class).invoke(null, paytranVO.getWay(), paytranPO);

		} catch (Exception e) {
			throw new FLException(150073, "不支持其他支付平台");
		}

		if (paytranPO.getStatus() == PaytranPO.STATUS_FAIL_INT) {
			throw new FLException(150044, "推送失败");
		}

		paytranDao.update(paytranPO);

		paytranVO.setPtid(paytranPO.getPtid());
		paytranVO.setMsgId(paytranPO.getMsgId());
		paytranVO.setCreateTime(paytranPO.getCreateTime());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkPaytran(PaytranVO paytranVO, String userId, int company) throws FLException {

		Long ptid = paytranVO.getPtid();
		PaytranPO paytranPO = null;

		if (ptid != null) {
			paytranPO = paytranDao.get(ptid);
		} else {
			paytranPO = paytranDao.queryPaytran(null, paytranVO.getType(), null, paytranVO.getPid()).get(0);
		}

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class).invoke(null, paytranPO);

		} catch (Exception e) {
			throw new FLException(150073, "不支持其他支付平台");
		}

		paytranDao.update(paytranPO);
		paytranDao.flush();

		paytranVO.setStatus(paytranPO.getStatus());
		paytranVO.setCreateTime(paytranPO.getCreateTime());

		if (paytranPO.getPid() != 0) {

			Wxpay wxpay = new Wxpay();
			wxpay.setPaymentptid(paytranPO.getPtid());
			wxpay.setPaymentMoney(paytranPO.getMoney());

			if (paytranPO.getStatus() == PaytranPO.STATUS_FAIL_INT) {

				failPayment(wxpay);

			} else {

				makePayment(wxpay, userId, company);

			}

		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void cancelPaytran(PaytranVO paytranVO, int company) throws FLException {

		PaytranPO paytranPO = paytranDao.get(paytranVO.getPtid());

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class).invoke(null, paytranPO);

		} catch (Exception e) {
			throw new FLException(150073, "不支持其他支付平台");
		}

		if (paytranPO.getStatus() == PaytranPO.STATUS_SUCCESS_INT) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		paytranPO.setStatus(PaytranPO.STATUS_INVALID_INT);

		paytranDao.update(paytranPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updatePaytran(List<Long> ptids, Long rid, Short status, Short type) throws FLException {

		int count = paytranDao.countPaytranByPtids(ptids);

		if (count > 0) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		paytranDao.updatePaytran(ptids, rid, status, type);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void wxpay(Wxpay wxpay, int company) throws FLException {

		if (wxpay.getPaymentMoney() == 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		UserPO creater = userDao.queryUserByUserId(wxpay.getUserId());
		String oderId = wxpay.getPaymentOrderId();
		long money = Arith.mul(wxpay.getPaymentMoney(), 10000);

		if (wxpay.getPaymentType() == 0) {

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(oderId);

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(oderId);

			if (advancePaymentPO == null) {
				advancePaymentPO = new AdvancePaymentPO();
				advancePaymentPO.setDecoration(decorationPO);
			}

			long oldBalance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, wxpay.getPaymentAttrType());
			long balance = Arith.add(oldBalance, money);

			PaymentPO paymentPO = new PaymentPO(oderId, balance, money, PaymentPO.PAYMENT_TYPE_COLLECTION_INT, wxpay.getPaymentAttrType(), PaymentPO.PAYMENT_STATUS_INIT_INT, decorationPO.getCompany(), DateUtil.getDateToTimestamp(new Date()), String.valueOf(new Date().getTime()));
			paymentPO.setCustomer(decorationPO.getCustomer());
			paymentPO.setCreater(creater);

			paymentDao.save(paymentPO);

			wxpay.setPaymentid(paymentPO.getPid());
		}

		PaytranPO paytranPO = new PaytranPO(oderId, wxpay.getPaymentid(), wxpay.getPaymentType(), "wechat", PaytranPO.STATUS_INIT_INT, money);
		paytranPO.setCreater(creater);

		paytranDao.save(paytranPO);

		String currentDate = DateUtil.current("yyyyMMdd").toString();
		String ident = FormatUtil.fillZero(new Random().nextInt(9999), "0000");
		String orderNo = String.format("%s%s%s", currentDate, paytranPO.getPtid(), ident);

		wxpay.setThreeOrderNo(orderNo);

		// reflect class and method with system config
		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("wxpay", Wxpay.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("wxpay", Wxpay.class).invoke(null, wxpay);

		} catch (Exception e) {
			throw new FLException(150073, "不支持其他支付平台");
		}

		paytranPO.setOutOrderNo(wxpay.getThreeOrderNo());

		paytranDao.update(paytranPO);

	}

	public void makePayment(Wxpay wxpay, String userId, int company) throws FLException {

		long ptid = wxpay.getPaymentptid();

		PaytranPO paytranPO = paytranDao.get(ptid);

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		short status = paytranPO.getStatus();

		if (status != PaytranPO.STATUS_SUCCESS_INT) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		if (wxpay.getPaymentMoney() != paytranPO.getMoney()) {
			throw new FLException(150025, "款项金额不正确");
		}

		userId = userId == null ? paytranPO.getCreater().getUserId() : userId;

		List<Long> ptids = Arrays.asList(ptid);
		long money = paytranPO.getMoney();
		String bankInfo = String.format("#%s|%s|%s#", paytranPO.getNo(), Arith.div(money, 1000.0), paytranPO.getCreateTime());
		String comment = String.format("wechat:金额%s元", Arith.div(money, 1000.0));

		short type = paytranPO.getType();

		// 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款
		switch (type) {
			case 0:

				PaymentVO paymentVO = new PaymentVO();

				PaymentPO paymentPO = paymentDao.get(paytranPO.getPid());

				if (paymentPO == null) {
					throw new FLException(150003, "款项不存在");
				}

				BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser"));
				paymentVO.setCustomer(new CustomerVO(paymentPO.getCustomer().getCid()));
				paymentVO.setBank(money);
				paymentVO.setBankInfo(bankInfo);
				paymentVO.setUniqueid("PT" + ptid);
				paymentVO.setComment(comment);

				paymentService.collectPayment(paymentVO, userId, ptids);

				break;

			case 1:

				DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();

				decorationPaymentVO.setDpid(paytranPO.getPid());
				decorationPaymentVO.setBank(money);
				decorationPaymentVO.setBankInfo(bankInfo);
				decorationPaymentVO.setComment(comment);

				decorationPaymentService.collectDecorationPayment(decorationPaymentVO, ptids, userId, company);

				break;

			case 3:

				SalesPaymentVO salesPaymentVO = new SalesPaymentVO(paytranPO.getPid());
				SalesReceiptVO salesReceiptVO = new SalesReceiptVO();

				salesReceiptVO.setBank(money);
				salesReceiptVO.setBankInfo(bankInfo);
				salesReceiptVO.setComment(comment);

				salesPaymentService.collectSalesPayment(salesPaymentVO, salesReceiptVO, ptids, userId, company);

				break;

			case 4:

				ServicePaymentVO servicePaymentVO = new ServicePaymentVO();
				ServicePaymentPO servicePaymentPO = servicePaymentDao.get(paytranPO.getPid());

				if (servicePaymentPO == null) {
					throw new FLException(150003, "款项不存在");
				}

				BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("decoration", "creater", "collecter", "confirmer", "serviceReceipt"));
				DecorationVO decorationVO = new DecorationVO();
				decorationVO.setOrderId(paytranPO.getOrderId());
				servicePaymentVO.setDecoration(decorationVO);

				ServiceReceiptVO serviceReceiptVO = new ServiceReceiptVO();

				serviceReceiptVO.setBank(money);
				serviceReceiptVO.setBankInfo(bankInfo);
				serviceReceiptVO.setComment(comment);

				servicePaymentService.collectServicePaymentForService(servicePaymentVO, serviceReceiptVO, ptids, userId, company);

				break;
		}

	}

	public void failPayment(Wxpay wxpay) throws FLException {

		long ptid = wxpay.getPaymentptid();

		PaytranPO paytranPO = paytranDao.get(ptid);

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		short status = paytranPO.getStatus();

		if (status != PaytranPO.STATUS_FAIL_INT) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		short type = paytranPO.getType();

		// 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款
		switch (type) {
			case 0:

				PaymentPO paymentPO = paymentDao.get(paytranPO.getPid());

				paymentPO.setStatus(PaymentPO.PAYMENT_STATUS_CANCELED_INT);
				paymentDao.update(paymentPO);

				break;

			case 4:

				ServicePaymentPO servicePaymentPO = servicePaymentDao.get(paytranPO.getPid());

				servicePaymentPO.setStatus(ServicePaymentPO.COLUMN_STATUS_CANCELED_INT);
				servicePaymentDao.update(servicePaymentPO);

				break;
		}

	}
}
