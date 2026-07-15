package com.fanglin.decoration.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.impl.DecorationAccountDaoImpl;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountService;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessageQueuingPO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;
import com.fanglin.core.security.SensitiveDataHelper;
import com.fanglin.wechat.service.WeChatAppService;
import com.fanglin.wechat.vo.WeChatPhoneInfoVO;

@Service("decorationAccountService")
@Transactional(readOnly = true)
public class DecorationAccountServiceImpl implements DecorationAccountService {

	private static final Logger log = LoggerFactory.getLogger(DecorationAccountServiceImpl.class);

	@Autowired
	private DecorationAccountDaoImpl decorationAccountDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ApprovalDao approvalDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private DecorationOperateDao decorationOperateDao;

	@Autowired
	private DecorationService decorationService;

	@Autowired
	private WeChatAppService weChatAppService;

	@Autowired
	private com.fanglin.information.dao.MessageQueuingDao messageQueuingDao;

	@Override
	public void pageDecorationAccount(Paging paging, List<Filter> filters, int company) throws FLException {

		if (filters.size() == 0) return;

		List<DecorationAccountPO> decorationAccountPOs = decorationAccountDao.pageDecorationAccount(paging, filters, company);
		List<DecorationAccountVO> decorationAccountVOs = new ArrayList<DecorationAccountVO>();

		for (DecorationAccountPO decorationAccountPO : decorationAccountPOs) {

			DecorationAccountVO decorationAccountVO = new DecorationAccountVO();

			decorationAccountVO.setDecoration(new DecorationVO());

			BeanUtil.copyProperties(decorationAccountPO, decorationAccountVO, Arrays.asList("decoration"));

			if (decorationAccountPO.getDecoration() != null) {
				decorationAccountPO.getDecoration().ptvcascade(decorationAccountVO.getDecoration());
			}

			decorationAccountVOs.add(decorationAccountVO);
		}

		paging.setData(decorationAccountVOs);
	}

	@Override
	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO) {

		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountVO.getOrderId());

		decorationAccountVO = new DecorationAccountVO();

		BeanUtil.copyProperties(decorationAccountPO, decorationAccountVO, Arrays.asList("decoration"));

		return decorationAccountVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateDecorationAccount(DecorationAccountVO decorationAccountVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationAccountVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "订单不存在");
		}

		if (decorationPO.getStatus() != DecorationPO.STATUS_SIGNED_INT) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountVO.getOrderId());

		if (decorationAccountPO == null) {

				decorationAccountPO = new DecorationAccountPO();
				BeanUtil.copyProperties(decorationAccountVO, decorationAccountPO, Arrays.asList("decoration"));

				decorationAccountDao.merge(decorationAccountPO);
			} else {

				BeanUtil.copyProperties(decorationAccountVO, decorationAccountPO, Arrays.asList("decoration"));

				decorationAccountDao.update(decorationAccountPO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO, String userId) throws FLException {

		if (decorationAccountVO == null || decorationAccountVO.getOrderId() == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationAccountVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "订单不存在");
		}

		if (decorationPO.getStatus() != DecorationPO.STATUS_SIGNED_INT) {
			throw new FLException(140004, "装修单状态不可操作");
		}

		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountVO.getOrderId());

		if (decorationAccountPO == null) {
			decorationAccountPO = new DecorationAccountPO();
			decorationAccountPO.setOrderId(decorationAccountVO.getOrderId());
			decorationAccountPO.setType(decorationPO.getType());
			decorationAccountPO.setTypeness(decorationPO.getTypeness());
			decorationAccountPO.setIsAffirm(DecorationAccountPO.ISAFFIRM_INIT_INT);

			decorationAccountDao.merge(decorationAccountPO);
		}

		if (decorationPO.getPaySacle() < 99) {
			throw new FLException(120018, "装修款比例不足");
		}

		if (approvalDao.countApprovalForInitByOrderId(decorationPO.getOrderId()) > 0) {
			throw new FLException(140037, "订单存在未处理审批项");
		}

		if (decorationPaymentDao.countDecorationPayment(decorationPO.getOrderId(), Arrays.asList(DecorationPaymentPO.ONETYPE_ADD_INT), Arrays.asList(DecorationPaymentPO.TWOTYPE_BASE_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT, DecorationPaymentPO.TWOTYPE_OTHER_INT), Arrays.asList(DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT)) > 0) {
			// throw new FLException(150030, "存在未处理款项");
		}

		UserPO operater = userDao.queryUserByUserId(userId);
		decorationOperateDao.save(new DecorationOperatePO().account(decorationAccountVO.getOrderId(), operater));

		decorationPO.setStatus(DecorationPO.STATUS_FINAL_INT);
		decorationPO.setAccountTime(DateUtil.getDateToTimestamp(new Date()));

		decorationDao.update(decorationPO);

		messageQueuingDao.save(new MessageQueuingPO().init(decorationPO.getOrderId(), "makeDecorationAccount", "{\"orderId\":\"" + decorationPO.getOrderId() + "\",\"userId\":\"" + userId + "\",\"event\":\"CUSTOMER_STATUS_CHANGED\"" + (decorationPO.getBusitype() != null ? ",\"busiTypeName\":\"" + decorationPO.getBusitype().getName() + "\"" : "") + "}"));
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void sendDecorationAccount(DecorationAccountVO decorationAccountVO, String userId) throws FLException {

		String orderId = decorationAccountVO.getOrderId();

		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(orderId);

		if (decorationAccountPO == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		log.info(String.format("pages/decoration/account/account?orderId=%s&daid=%s", orderId, decorationAccountPO.getDaid()));

		decorationService.sendMessage(orderId, "装修单", "请您及时确认决算信息.", String.format("pages/decoration/account/account?orderId=%s&daid=%s", orderId, decorationAccountPO.getDaid()), creater);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int affirmDecorationAccount(DecorationVO decorationVO, DecorationAccountVO decorationAccountVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException {

		if (decorationVO == null || decorationVO.getCustomer() == null || decorationAccountVO == null || decorationAccountVO.getOrderId() == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		if (securityCode != null && verifyCode != null && !FormatUtil.checkVode(verifyCode, securityCode)) {
			throw new FLException(330012, "验证失败,请重新验证");
		}

		String orderId = decorationAccountVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		WeChatPhoneInfoVO weChatPhoneInfoVO = null;

		if (phoneCode != null) {
			weChatPhoneInfoVO = weChatAppService.queryPhoneInfo(phoneCode, company);
		}

		if (weChatPhoneInfoVO != null && weChatPhoneInfoVO.getPhoneNumber() != null) {
			decorationVO.getCustomer().setPhone(weChatPhoneInfoVO.getPhoneNumber());
		}

		if (decorationVO.getCustomer().getPhone() != null && !SensitiveDataHelper.decrypt(decorationPO.getCustomer().getPhone()).equals(decorationVO.getCustomer().getPhone())) {
			throw new FLException(130115, "客户电话不匹配");
		}

		com.fanglin.customer.vo.DecorationVO cecorationVO = new com.fanglin.customer.vo.DecorationVO();

		cecorationVO.setOrderId(orderId);
		cecorationVO.setUnionId(decorationVO.getCustomer().getNo());

		if (decorationVO.getCustomer().getNo() != null && decorationService.queryDecoration(cecorationVO) == null) {
			throw new FLException(130115, "装修单未绑定");
		}

		if (decorationAccountVO.getDaid() == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		DecorationAccountPO decorationAccountPO = decorationAccountDao.get(decorationAccountVO.getDaid());

		if (decorationAccountPO == null) {
			throw new FLException(140081, "决算信息不存在");
		}

		if (decorationAccountPO.getIsAffirm() == DecorationAccountPO.ISAFFIRM_INIT_INT) {

			decorationAccountPO.setIsAffirm(DecorationAccountPO.ISAFFIRM_CONFIRMED_INT);
			decorationAccountPO.setAffirmTime(DateUtil.getDateToTimestamp(new Date()));

			decorationAccountDao.update(decorationAccountPO);
		}

		return 0;
	};

}
