package com.fanglin.payment.service.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustypeDao;
import com.fanglin.communion.po.CustypePO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.PaymentTypeDao;
import com.fanglin.data.po.PaymentTypePO;
import com.fanglin.data.po.ReceiptTypePO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.bean.Wxpay;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.PaymentDao;
import com.fanglin.payment.dao.PaytranDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.dao.ServicePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
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
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
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

	@Autowired
	private CustypeDao custypeDao;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private PaymentTypeDao paymentTypeDao;

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

		List<PaytranPO> paytranPOs = paytranDao.queryPaytran(paytran.getOrderId(), paytran.getType(), paytran.getAtttype(), paytran.getRid(), paytran.getPid(), null);
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
	public PaytranVO queryPaytranByPtid(PaytranVO paytran) {

		PaytranPO paytranPO = paytranDao.get(paytran.getPtid());
		PaytranVO paytranVO = new PaytranVO();

		BeanUtil.copyProperties(paytranPO, paytranVO, Arrays.asList("creater"));
		BeanUtil.copyProperties(paytranPO.getCreater(), paytranVO.getCreater(), Arrays.asList("role", "dept", "duty"));

		return paytranVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addPaytran(PaytranVO paytranVO, String userId, int company) throws FLException {

		if (Arith.div(paytranVO.getMoney(), 1000.0) == 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		if (paytranVO.getSn() != null && paytranVO.getSn() != "") {
			if (paytranDao.countPaytran(paytranVO.getSn(), PaytranPO.STATUS_INIT_INT) != 0) {
				throw new FLException(150048, "转换款支付未完成");
			}
		}

		PaytranPO paytranPO = new PaytranPO();

		UserPO creater = userDao.queryUserByUserId(userId);

		// 小程序支付端:会生成pid和orderId 信息平台:pid=0, 只会生成orderId (不能乱, pid是否>0会用于判断)
		BeanUtil.copyProperties(paytranVO, paytranPO, Arrays.asList("creater"));
		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(paytranPO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		String dgrade = null;
		String sgrade = null;

		if (paytranVO.getAtttype() == PaytranPO.ATTTYPE_DECORATION_INT) {
			dgrade = decorationPO.getGrade();
		} else {
			sgrade = decorationPO.getGrade();
		}

		// 获取商户
		CustypePO custypePO = custypeDao.queryCustype(company, dgrade, sgrade, paytranPO.getType());

		if (custypePO != null) {
			paytranPO.setCtid(custypePO.getCtid());
		}

		paytranPO.setStatus(PaytranPO.STATUS_INIT_INT);

		paytranPO.setCreater(creater);

		paytranDao.save(paytranPO); // 国通的pos推送需要第三方账号, 第三方账号组成有ptid

		paytranVO.setPtid(paytranPO.getPtid());
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkPaytran(PaytranVO paytranVO, String userId, int company) throws FLException {

		Long ptid = paytranVO.getPtid();

		PaytranPO paytranPO = null;

		if (ptid != null) {
			paytranPO = paytranDao.get(ptid);
		} else {
			List<PaytranPO> paytranPOs = paytranDao.queryPaytran(null, paytranVO.getType(), paytranVO.getAtttype(), null, paytranVO.getPid(), null);

			if (paytranPOs.size() == 0) {
				throw new FLException(150043, "转换款不存在");
			}

			paytranPO = paytranPOs.get(0);
		}

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {

			paytranVO.setStatus(paytranPO.getStatus());
			paytranVO.setCreateTime(paytranPO.getCreateTime());

			return;
		}

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		// 获取商户
		CustypePO custypePO = custypeDao.get(paytranPO.getCtid());

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class, CustypePO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class, CustypePO.class).invoke(null, paytranPO, custypePO);

		} catch (FLException e) {
			throw e;
		} catch (InvocationTargetException e) {
			if (e.getTargetException().getClass() == FLException.class) {
				throw (FLException) e.getTargetException();
			} else {
				System.out.println(e.getMessage());
				throw new FLException(150073, "不支持其他支付平台");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new FLException(150073, "不支持其他支付平台");
		}

		paytranDao.update(paytranPO);
		paytranDao.flush();

		paytranVO.setStatus(paytranPO.getStatus());
		paytranVO.setCreateTime(paytranPO.getCreateTime());

		// 这里注意区分
		if (paytranPO.getPid() != 0) {

			Wxpay wxpay = new Wxpay();
			wxpay.setPaymentptid(paytranPO.getPtid());
			wxpay.setPaymentMoney(paytranPO.getMoney());

			if (paytranPO.getStatus() == PaytranPO.STATUS_FAIL_INT) {
				failPayment(wxpay);
			} else {
				makePayment(wxpay, userId);
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

		if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		// 获取商户
		CustypePO custypePO = custypeDao.get(paytranPO.getCtid());

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class, CustypePO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("check", PaytranPO.class, CustypePO.class).invoke(null, paytranPO, custypePO);

		} catch (FLException e) {
			throw e;
		} catch (InvocationTargetException e) {
			if (e.getTargetException().getClass() == FLException.class) {
				throw (FLException) e.getTargetException();
			} else {
				System.out.println(e.getMessage());
				throw new FLException(150073, "不支持其他支付平台");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
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
	public void sendPaytran(PaytranVO paytranVO) throws FLException {

		PaytranPO paytranPO = paytranDao.get(paytranVO.getPtid());

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		String orderId = paytranPO.getOrderId();

		long pid = paytranPO.getType() == PaytranPO.TYPE_PAYTRAN_INT ? paytranPO.getPtid() : paytranPO.getPid();

		decorationService.sendMessage(orderId, "装修收款", String.format("装修待付款金额%.3f元", Arith.div(paytranPO.getMoney(), 1000.0)), String.format("pages/payInfo/payInfo?orderId=%s&pid=%s&paymentType=%s", paytranPO.getOrderId(), pid, paytranPO.getType()));

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void wxpay(Wxpay wxpay) throws FLException {

		if (wxpay.getPaymentMoney() == 0) {
			throw new FLException(150025, "款项金额不正确");
		}

		UserPO creater = userDao.queryUserByUserId(wxpay.getUserId());
		String oderId = wxpay.getPaymentOrderId();
		long money = Arith.mul(wxpay.getPaymentMoney(), 10000);

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(oderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		short atttype = 0;

		if (wxpay.getPaymentType() == PaytranPO.TYPE_ADVANCE_INT) {

			if (wxpay.getPaymentid() == null || wxpay.getPaymentid() == 0) {

				AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(oderId);

				if (advancePaymentPO == null) {
					advancePaymentPO = new AdvancePaymentPO();
					advancePaymentPO.setDecoration(decorationPO);
				}

				if (wxpay.getPaymentAttrType() == PaytranPO.ATTTYPE_MATERIAL_INT) {
					atttype = 2;
				}

				long oldBalance = AdvancePaymentServiceImpl.getCustomerBalanceByType(advancePaymentPO, atttype);
				long balance = Arith.add(oldBalance, money);

				PaymentPO paymentPO = new PaymentPO(oderId, balance, money, PaymentPO.PAYMENT_TYPE_COLLECTION_INT, atttype, PaymentPO.PAYMENT_STATUS_INIT_INT, decorationPO.getCompany(), DateUtil.getDateToTimestamp(new Date()), String.valueOf(new Date().getTime()));
				paymentPO.setCustomer(decorationPO.getCustomer());
				paymentPO.setCreater(creater);

				paymentDao.save(paymentPO);

				wxpay.setPaymentid(paymentPO.getPid());
			}

		} else if (wxpay.getPaymentType() == PaytranPO.TYPE_DECORATION_INT) {

			DecorationPaymentPO decorationPaymentPO = decorationPaymentDao.get(wxpay.getPaymentid());

			if (decorationPaymentPO == null) {
				throw new FLException(150003, "款项不存在");
			}

			short sort = decorationPaymentPO.getSort();

			// 装修款收款过程利用排序字段控制收款顺序
			if (sort > 1) {
				DecorationPaymentPO prevDecorationPaymentPO = decorationPaymentDao.queryDecorationPaymentByOrderIdAndSort(oderId, (short) (sort - 1));

				if (prevDecorationPaymentPO != null) {
					if (prevDecorationPaymentPO.getPaymentStatus() == (DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT)) {
						throw new FLException(150009, "前置款项未处理");
					}
				}
			}

			PaymentTypePO paymentTypePO = paymentTypeDao.get(decorationPaymentPO.getPtid());

			if (paymentTypePO != null) {
				if (decorationPO.getPaySacle() < paymentTypePO.getPayScale()) {
					throw new FLException(120018, "装修款比例不足");
				}

				if (decorationPO.getSaleScale() < paymentTypePO.getSaleScale()) {
					throw new FLException(120033, "销售比例不足");
				}
			}
		}

		PaytranPO paytranPO = null;

		if (wxpay.getPaymentptid() == null || wxpay.getPaymentptid() == 0) {
			paytranPO = new PaytranPO(oderId, wxpay.getPaymentid(), wxpay.getPaymentType(), wxpay.getPaymentAttrType(), "", PaytranPO.STATUS_INIT_INT, money);
			paytranPO.setCreater(creater);
			paytranDao.save(paytranPO);
		} else {
			paytranPO = paytranDao.get(wxpay.getPaymentptid());

			if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {
				throw new FLException(150047, "转换款支付不可操作");
			}
		}

		String currentDate = DateUtil.current("yyyyMMdd").toString();
		String ident = FormatUtil.fillZero(new Random().nextInt(9999), "0000");
		String orderNo = String.format("%s%s%s", currentDate, paytranPO.getPtid(), ident);

		wxpay.setThreeOrderNo(orderNo);

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", decorationPO.getCompany());

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		String dgrade = null;
		String sgrade = null;

		if (paytranPO.getAtttype() == PaytranPO.ATTTYPE_DECORATION_INT) {
			dgrade = decorationPO.getGrade();
		} else {
			sgrade = decorationPO.getGrade();
		}

		// 获取商户
		CustypePO custypePO = custypeDao.queryCustype(decorationPO.getCompany(), dgrade, sgrade, paytranPO.getType());

		CompanyPO companyPO = companyDao.get(custypePO.getCompany());

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("wxpay", Wxpay.class, CustypePO.class, CompanyPO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("wxpay", Wxpay.class, CustypePO.class, CompanyPO.class).invoke(null, wxpay, custypePO, companyPO);

		} catch (FLException e) {
			throw e;
		} catch (InvocationTargetException e) {
			if (e.getTargetException().getClass() == FLException.class) {
				throw (FLException) e.getTargetException();
			} else {
				System.out.println(e.getMessage());
				throw new FLException(150073, "不支持其他支付平台");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			throw new FLException(150073, "不支持其他支付平台");
		}

		paytranPO.setOutOrderNo(wxpay.getThreeOrderNo());
		paytranPO.setCtid(custypePO.getCtid());

		ReceiptTypePO receiptTypePO = custypePO.getReceiptType();

		if (receiptTypePO == null) {
			throw new FLException(130005, "收据类型不存在");
		}

		paytranPO.setNo(receiptTypePO.getNo());

		paytranDao.update(paytranPO);

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void posPay(PaytranVO paytranVO, int company) throws FLException {

		PaytranPO paytranPO = paytranDao.get(paytranVO.getPtid());

		if (paytranPO == null) {
			throw new FLException(150043, "转换款不存在");
		}

		if (paytranPO.getStatus() != PaytranPO.STATUS_INIT_INT) {
			throw new FLException(150047, "转换款支付不可操作");
		}

		if (paytranPO.getOutOrderNo() == null) {
			String currentDate = DateUtil.current("yyyyMMdd").toString();
			String ident = FormatUtil.fillZero(new Random().nextInt(9999), "0000");

			String orderNo = String.format("%s%s%s", currentDate, paytranPO.getPtid(), ident);

			paytranPO.setOutOrderNo(orderNo);
		}

		SystemConfigPO airpos = systemConfigDao.querySystemConfig("PAYMENT_PLATFORM_PATH_STR", company);

		if (airpos == null || "".equals(airpos.getValue())) {
			throw new FLException(150071, "不支持其他支付平台");
		}

		// 获取商户
		CustypePO custypePO = custypeDao.get(paytranPO.getCtid());

		try {
			if (Class.forName(String.format("%s.Airpos", airpos.getValue())) == null || Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("pospay", String.class, PaytranPO.class, CustypePO.class) == null) {
				throw new FLException(150072, "不支持其他支付平台");
			}

			Class.forName(String.format("%s.Airpos", airpos.getValue())).getMethod("pospay", String.class, PaytranPO.class, CustypePO.class).invoke(null, paytranVO.getWay(), paytranPO, custypePO);

		} catch (FLException e) {
			throw e;
		} catch (InvocationTargetException e) {
			if (e.getTargetException().getClass() == FLException.class) {
				throw (FLException) e.getTargetException();
			} else {
				System.out.println(e.getMessage());
				throw new FLException(150073, "不支持其他支付平台");
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
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

	public void makePayment(Wxpay wxpay, String userId) throws FLException {

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

		// 获取商户-公司
		CustypePO custypePO = custypeDao.get(paytranPO.getCtid());

		int company = custypePO != null ? custypePO.getCompany() : CompanyPO.TYPE_HEADQUARTER_INT;

		userId = userId == null ? paytranPO.getCreater().getUserId() : userId;

		List<Long> ptids = new ArrayList<Long>();
		String orderId = paytranPO.getOrderId();
		long pid = paytranPO.getPid();
		short type = paytranPO.getType();
		short atttype = paytranPO.getAtttype();
		long paidMoney = 0;
		String bankInfo = "#";

		List<PaytranPO> paytrans = paytranDao.queryPaytran(orderId, type, atttype, null, pid, PaytranPO.STATUS_SUCCESS_INT);

		for (PaytranPO paytran : paytrans) {
			ptids.add(paytran.getPtid());
			paidMoney = Arith.add(paidMoney, paytran.getMoney());
			String info = String.format("%s|%s|%s|%s#", paytran.getNo(), Arith.div(paytran.getMoney(), 1000.0), paytran.getCreateTime(), paytran.getPtid());
			bankInfo = String.format("%s%s", bankInfo, info);
		}

		String comment = String.format("wechat:金额%s元", Arith.div(paidMoney, 1000.0));

		// 0: 预付款 , 1: 装修款 , 2: 主材款 , 3: 销售款 , 4: 服务款 , 5: 活动款
		switch (type) {
			case 0:

				PaymentVO paymentVO = new PaymentVO();

				PaymentPO paymentPO = paymentDao.get(paytranPO.getPid());

				if (paymentPO == null) {
					throw new FLException(150003, "款项不存在");
				}

				if (paymentPO.getStatus() != PaymentPO.PAYMENT_STATUS_INIT_INT) {
					throw new FLException(150036, "款项状态不可操作");
				}

				if (paidMoney != paymentPO.getRecharge()) return;

				BeanUtil.copyProperties(paymentPO, paymentVO, Arrays.asList("customer", "collectUser", "company"));
				paymentVO.setCustomer(new CustomerVO(paymentPO.getCustomer().getCid()));
				paymentVO.setBank(paidMoney);
				paymentVO.setBankInfo(bankInfo);
				paymentVO.setUniqueid("PT" + ptid);
				paymentVO.setComment(comment);

				paymentService.collectPayment(paymentVO, userId, ptids);

				break;

			case 1:

				long decorationReferMoney = decorationPaymentDao.get(pid).getReferMoney();

				if (paidMoney != decorationReferMoney) return;

				DecorationPaymentVO decorationPaymentVO = new DecorationPaymentVO();

				decorationPaymentVO.setDpid(paytranPO.getPid());
				decorationPaymentVO.setBank(paidMoney);
				decorationPaymentVO.setBankInfo(bankInfo);
				decorationPaymentVO.setComment(comment);

				decorationPaymentService.collectDecorationPayment(decorationPaymentVO, ptids, userId, company);

				break;

			case 3:

				long salesReferMoney = salesPaymentDao.get(pid).getReferMoney();

				if (paidMoney != salesReferMoney) return;

				SalesPaymentVO salesPaymentVO = new SalesPaymentVO(paytranPO.getPid());
				SalesReceiptVO salesReceiptVO = new SalesReceiptVO();

				salesReceiptVO.setBank(paidMoney);
				salesReceiptVO.setBankInfo(bankInfo);
				salesReceiptVO.setComment(comment);

				salesPaymentService.collectSalesPayment(salesPaymentVO, salesReceiptVO, ptids, userId, company);

				break;

			case 4:

				long serviceReferMoney = servicePaymentDao.get(pid).getServiceMoney();

				if (paidMoney != serviceReferMoney) return;

				ServicePaymentVO servicePaymentVO = new ServicePaymentVO();
				ServicePaymentPO servicePaymentPO = servicePaymentDao.get(paytranPO.getPid());

				if (servicePaymentPO == null) {
					throw new FLException(150003, "款项不存在");
				}

				if (servicePaymentPO.getStatus() != ServicePaymentPO.COLUMN_INITIALSTATUS_INT) {
					throw new FLException(150036, "款项状态不可操作");
				}

				BeanUtil.copyProperties(servicePaymentPO, servicePaymentVO, Arrays.asList("decoration", "creater", "collecter", "confirmer", "serviceReceipt"));
				DecorationVO decorationVO = new DecorationVO();
				decorationVO.setOrderId(paytranPO.getOrderId());
				servicePaymentVO.setDecoration(decorationVO);
				servicePaymentVO.setReferMoney(paidMoney);

				ServiceReceiptVO serviceReceiptVO = new ServiceReceiptVO();

				serviceReceiptVO.setBank(paidMoney);
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
