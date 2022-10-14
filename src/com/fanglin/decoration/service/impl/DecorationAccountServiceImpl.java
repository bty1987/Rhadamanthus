package com.fanglin.decoration.service.impl;

import java.util.Arrays;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.approval.dao.ApprovalDao;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationOperateDao;
import com.fanglin.decoration.dao.impl.DecorationAccountDaoImpl;
import com.fanglin.decoration.po.DecorationAccountPO;
import com.fanglin.decoration.po.DecorationOperatePO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAccountService;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("decorationAccountService")
@Transactional(readOnly = true)
public class DecorationAccountServiceImpl implements DecorationAccountService {

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

	@Override
	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO) {

		DecorationAccountPO decorationAccountPO = decorationAccountDao.queryDecorationAccount(decorationAccountVO.getOrderId());

		decorationAccountVO = new DecorationAccountVO();

		BeanUtil.copyPropertie(decorationAccountPO, decorationAccountVO);

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
			BeanUtil.copyPropertie(decorationAccountVO, decorationAccountPO);

			decorationAccountDao.merge(decorationAccountPO);
		} else {

			BeanUtil.copyPropertie(decorationAccountVO, decorationAccountPO);

			decorationAccountDao.update(decorationAccountPO);
		}

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationAccountVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(130014, "订单不存在");
		}

		if (decorationPO.getStatus() != DecorationPO.STATUS_SIGNED_INT) {
			throw new FLException(140004, "装修单状态不可操作");
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

	}

}
