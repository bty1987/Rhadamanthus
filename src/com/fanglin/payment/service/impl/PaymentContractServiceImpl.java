package com.fanglin.payment.service.impl;

import com.fanglin.elecsign.enums.ElecsignProvider;
import com.fanglin.elecsign.enums.ElecsignScene;
import com.fanglin.elecsign.router.ElecsignRouter;
import com.fanglin.elecsign.service.ElecsignService;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.data.common.dao.SignetDao;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.data.po.SignetPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.fadada.bean.Contract;
import com.fanglin.payment.dao.PaymentContractDao;
import com.fanglin.payment.po.PaymentContractPO;
import com.fanglin.payment.service.PaymentContractService;
import com.fanglin.payment.vo.PaymentContractVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("paymentContractService")
@Transactional(readOnly = true)
public class PaymentContractServiceImpl implements PaymentContractService {

	@Autowired
	private ElecsignRouter elecsignRouter;
	@Autowired
	private PaymentContractDao paymentContractDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private SignetDao signetDao;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Autowired
	private DecorationService decorationService;

	@Override
	public void pagePaymentContract(Paging paging, List<Filter> filters) {

		List<PaymentContractPO> paymentContractPOs = paymentContractDao.pagePaymentContract(paging, filters);
		List<PaymentContractVO> paymentContractVOs = new ArrayList<PaymentContractVO>();

		for (PaymentContractPO paymentContractPO : paymentContractPOs) {

			PaymentContractVO paymentContractVO = new PaymentContractVO(new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyPropertie(paymentContractPO, paymentContractVO, Arrays.asList("creater", "signner", "filinner"));
			BeanUtil.copyProperties(paymentContractPO.getCreater(), paymentContractVO.getCreater(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(paymentContractPO.getSignner(), paymentContractVO.getSignner(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
			BeanUtil.copyProperties(paymentContractPO.getFilinner(), paymentContractVO.getFilinner(), Arrays.asList("role", "dept", "duty", "password", "identity", "company"));

			paymentContractVOs.add(paymentContractVO);
		}

		paging.setData(paymentContractVOs);
	}

	@Override
	public PaymentContractVO queryPaymentContract(PaymentContractVO paymentContract) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.queryPaymentContract(paymentContract.getRtid(), paymentContract.getPaymentType());

		PaymentContractVO paymentContractVO = new PaymentContractVO();

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		BeanUtil.copyProperties(paymentContractPO, paymentContractVO, Arrays.asList("creater", "signner", "filinner"));

		paymentContractVO.setCreater(new UserBaseVO());

		paymentContractVO.setSignner(new UserBaseVO());

		paymentContractVO.setFilinner(new UserBaseVO());

		if (paymentContractPO.getCreater() != null) {
			BeanUtil.copyProperties(paymentContractPO.getCreater(), paymentContractVO.getCreater(), Arrays.asList("dept", "duty"));
		}

		if (paymentContractPO.getSignner() != null) {
			BeanUtil.copyProperties(paymentContractPO.getSignner(), paymentContractVO.getSignner(), Arrays.asList("dept", "duty"));
		}

		if (paymentContractPO.getFilinner() != null) {
			BeanUtil.copyProperties(paymentContractPO.getFilinner(), paymentContractVO.getFilinner(), Arrays.asList("dept", "duty"));
		}

		return paymentContractVO;
	}

	@Override
	public void sendPaymentContractForAuth(PaymentContractVO paymentContractVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}
	}

	@Override
	public void sendPaymentContract(PaymentContractVO paymentContractVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		String orderId = paymentContractPO.getOrderId();

		SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");

		decorationService.sendMessage(orderId, "装修单", String.format("装修单号:%s, 合同信息.", orderId), String.format("%s/views/contract/redirect.html?dcid=%d&type=%d&module=payment", isv.getValue(), paymentContractVO.getPcid(), paymentContractVO.getType()));
	}

	@Override
	public String redirectPaymentContract(PaymentContractVO paymentContractVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		String orderId = paymentContractPO.getOrderId();
		String url = "";

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		short type = paymentContractVO.getType();
		short status = paymentContractPO.getStatus();

		if (type == PaymentContractPO.TYPE_SIGNET_INT && status == PaymentContractPO.STATUS_VALID_INT) {
			SystemConfigPO isv = systemConfigDao.querySystemConfig("isv");
			url = String.format("%s/signature.html?cid=%d", isv.getValue(), decorationPO.getCustomer().getCid());
		} else if (type == PaymentContractPO.TYPE_SIGN_INT && status == PaymentContractPO.STATUS_VALID_INT) {
			url = routeForRecord(paymentContractPO).extsign(decorationPO.getCustomer().getSignno(), (Contract) paymentContractPO);
		} else if (type == PaymentContractPO.TYPE_VIEW_INT && status == PaymentContractPO.STATUS_VALID_INT) {
			url = paymentContractPO.getViewpdf();
		} else if (type == PaymentContractPO.TYPE_DOWNLOAD_INT && status == PaymentContractPO.STATUS_SIGN_INT) {
			url = paymentContractPO.getDownload();
		} else {
			throw new FLException(150066, "合同状态不可操作");
		}

		return url;
	}

	@Override
	public String viewPaymentContract(PaymentContractVO paymentContractVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");

		}

		return routeForRecord(paymentContractPO).view(paymentContractPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public String signPaymentContractForCompany(SignetVO signetVO, PaymentContractVO paymentContractVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		SignetPO signetPO = signetDao.get(signetVO.getSid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		if (paymentContractPO.getStatus() != 0) {
			throw new FLException(150066, "合同状态不可操作");
		}

		routeForRecord(paymentContractPO).autosign(signetPO.getSignno(), signetPO.getKeyword(), paymentContractPO, signetPO.getSignid(), ElecsignService.KEYWORD_STRATEGY_LAST_STR);

		paymentContractPO.setComsignTime(DateUtil.getDateToTimestamp(new Date()));

		paymentContractDao.update(paymentContractPO);

		return "";
	}

	@Override
	public String signPaymentContractForCustomer(PaymentContractVO paymentContractVO, CustomerVO customerVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		if (paymentContractPO.getStatus() != PaymentContractPO.STATUS_VALID_INT) {
			throw new FLException(150066, "合同状态不可操作");
		}

		CustomerPO customerPO = customerDao.get(customerVO.getCid());

		return routeForRecord(paymentContractPO).extsign(customerPO.getSignno(), paymentContractPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public PaymentContractVO addPaymentContract(PaymentContractVO paymentContractVO, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		PaymentContractPO paymentContractPO = new PaymentContractPO();

		BeanUtil.copyProperties(paymentContractVO, paymentContractPO, Arrays.asList("contract", "creater"));

		paymentContractPO.setCreater(creater);
		paymentContractPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		paymentContractDao.save(paymentContractPO);

		paymentContractVO.setPcid(paymentContractPO.getPcid());

		routeForCreate(paymentContractPO, 0).upload(paymentContractPO, paymentContractVO.getViewpdf());

		return paymentContractVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affixPaymentContract(PaymentContractVO paymentContractVO, String userId) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		if (paymentContractPO.getStatus() != PaymentContractPO.STATUS_VALID_INT) {
			throw new FLException(150066, "合同状态不可操作");
		}

		UserPO signner = userDao.queryUserByUserId(userId);

		paymentContractPO.setSignner(signner);
		paymentContractPO.setStatus(PaymentContractPO.STATUS_SIGN_INT);
		paymentContractPO.setCussignTime(DateUtil.getDateToTimestamp(new Date()));

		paymentContractDao.update(paymentContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expirePaymentContract(PaymentContractVO paymentContractVO) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		if (paymentContractPO.getStatus() != PaymentContractPO.STATUS_VALID_INT) {
			throw new FLException(150066, "合同状态不可操作");
		}

		paymentContractPO.setStatus(PaymentContractPO.STATUS_NULL_INT);

		paymentContractDao.update(paymentContractPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int filingPaymentContract(PaymentContractVO paymentContractVO, String userId) throws FLException {

		PaymentContractPO paymentContractPO = paymentContractDao.get(paymentContractVO.getPcid());

		if (paymentContractPO == null) {
			throw new FLException(150065, "合同信息不存在");
		}

		if (paymentContractPO.getStatus() != PaymentContractPO.STATUS_SIGN_INT) {
			throw new FLException(150066, "合同状态不可操作");
		}

		routeForRecord(paymentContractPO).filing(paymentContractPO);

		UserPO filinner = userDao.queryUserByUserId(userId);

		paymentContractPO.setFilinner(filinner);
		paymentContractPO.setStatus(PaymentContractPO.STATUS_FILE_INT);
		paymentContractPO.setFilingTime(DateUtil.getDateToTimestamp(new Date()));

		paymentContractDao.update(paymentContractPO);

		return 0;
	}

	/** 电子签路由（生成/上传：重签按记录厂商，首签按公司×场景配置并记录厂商到合同 provider 字段） */
	private ElecsignService routeForCreate(PaymentContractPO paymentContractPO, int company) throws FLException {

		if (paymentContractPO.getProvider() != null) {
			return elecsignRouter.route(paymentContractPO.getProvider());
		}

		ElecsignProvider provider = elecsignRouter.resolveProvider(company, ElecsignScene.PAYMENT);

		paymentContractPO.setProvider(provider.code());

		return elecsignRouter.route(provider);
	}

	/** 电子签路由（签署/查看/归档：按合同记录的厂商路由，保证全链路厂商一致与历史可回溯；null 视同法大大） */
	private ElecsignService routeForRecord(PaymentContractPO paymentContractPO) throws FLException {
		return elecsignRouter.route(paymentContractPO.getProvider());
	}

}
