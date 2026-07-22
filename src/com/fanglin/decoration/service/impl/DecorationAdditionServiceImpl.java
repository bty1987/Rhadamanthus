package com.fanglin.decoration.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.construction.dao.ConstructionScheduleDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.construction.po.ConstructionSchedulePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.dao.ConstructionNodeDao;
import com.fanglin.data.po.ConstructionNodePO;
import com.fanglin.decoration.dao.DecorationAdditionDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationHolonomyDao;
import com.fanglin.decoration.dao.DecorationMidpackDao;
import com.fanglin.decoration.po.DecorationAdditionPO;
import com.fanglin.decoration.po.DecorationHolonomyPO;
import com.fanglin.decoration.po.DecorationMidpackPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.service.DecorationAdditionService;
import com.fanglin.decoration.service.DecorationAccountStatusService;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.DecorationPaymentDao;
import com.fanglin.payment.dao.SalesPaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.DecorationPaymentPO;
import com.fanglin.quotation.dao.QuotationDao;
import com.fanglin.quotation.po.QuotationPO;
import com.fanglin.sales.dao.OalesDao;
import com.fanglin.sales.po.OalesPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;

@Service("decorationAdditionService")
@Transactional(readOnly = true)
public class DecorationAdditionServiceImpl implements DecorationAdditionService {

	@Autowired
	private DecorationAdditionDao decorationAdditionDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private QuotationDao quotationDao;

	@Autowired
	private DecorationPaymentDao decorationPaymentDao;

	@Autowired
	private OalesDao oalesDao;

	@Autowired
	private SalesPaymentDao salesPaymentDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private DecorationMidpackDao decorationMidpackDao;

	@Autowired
	private DecorationHolonomyDao decorationHolonomyDao;

	@Autowired
	private DecorationAccountStatusService decorationAccountStatusService;

	@Autowired
	private ConstructionNodeDao constructionNodeDao;

	@Autowired
	private ConstructionScheduleDao constructionScheduleDao;

	@Override
	public DecorationAdditionVO queryDecorationAdditionByOrderId(DecorationAdditionVO decorationAdditionVO) {

		DecorationAdditionPO decorationAdditionPO = decorationAdditionDao.queryDecorationAdditionByOrderId(decorationAdditionVO.getOrderId());
		decorationAdditionVO = new DecorationAdditionVO();

		BeanUtil.copyProperties(decorationAdditionPO, decorationAdditionVO);

		return decorationAdditionVO;
	}

	@Override
	public short queryDecorationSchedule(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		QuotationPO quotationPO = quotationDao.queryQuotationForDefaultByOrderId(decorationVO.getOrderId());

		if (quotationPO == null) {
			throw new FLException(200017, "默认报价不存在");
		}

		ConstructionNodePO constructionNoderPO = constructionNodeDao.get(decorationPO.getProjectStatus());

		if (constructionNoderPO == null) {
			throw new FLException(130026, "工程节点不存在");
		}

		short status = decorationPO.getStatus();
		long projectStatus = constructionNoderPO.getSort();

		short schedule = 0;// 默认值 0.订单生成

		if (quotationPO != null && schedule < 1) // 判断报价信息是否存在, 存在 值为1.预算
		schedule = 1;

		if (status == DecorationPO.STATUS_SIGNED_INT && schedule < 2) // 判断装修单状态是否为3, 是 值为 2.合同签单
		schedule = 2;

		if (decorationPO.getSourceStatus() == DecorationPO.STATUS_CONTRACT_CONFIRMATION_INT && schedule < 3) // 判断装修确认状态是否为1, 是 值为 3.签单设计方案完成
		schedule = 3;

		if (decorationPO.getSourceStatus() == DecorationPO.STATUS_SETTING_OUT_CONFIRMATION_INT && schedule < 4) // 判断装修确认状态是否为2, 是 值为 4.开工设计方案完成
		schedule = 4;

		// 【改进】查询订单实际创建的施工进度节点，动态判断节点范围
		List<ConstructionSchedulePO> constructionSchedules = constructionScheduleDao.queryConstructionScheduleByOrderId(decorationVO.getOrderId());

		if (constructionSchedules != null && !constructionSchedules.isEmpty()) {
			// 计算订单实际施工节点的schedule范围
			short minSchedule = Short.MAX_VALUE;
			short maxSchedule = Short.MIN_VALUE;

			for (ConstructionSchedulePO cs : constructionSchedules) {

				short currentSchedule = cs.getSchedule();

				if (currentSchedule < minSchedule) {
					minSchedule = currentSchedule;
				}
				if (currentSchedule > maxSchedule) {
					maxSchedule = currentSchedule;
				}
			}

			// 判断当前工程状态是否在订单实际施工节点范围内（排除放线节点schedule=2，因为它是工程完工状态）
			if (projectStatus > ConstructionPO.SCHEDULE_TYPE_PUTLINE_INT && projectStatus >= minSchedule && projectStatus <= maxSchedule && schedule < (short) (projectStatus + 2)) {
				schedule = (short) (projectStatus + 2);
			}
		}

		if (status == DecorationPO.STATUS_FINAL_INT) // 判断装修单状态是否为7, 是 值为 16.决算
		schedule = 115;

		if (projectStatus == ConstructionPO.SCHEDULE_TYPE_PUTLINE_INT) // 判断装修单工程状态是否为2, 是 值为 17.工程完工
		schedule = 116;

		return schedule;
	}

	@Override
	public void updateDecorationForPayScale(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		long payTotal = 0;
		long factPrice = 0;

		Short[] paymentStatus = new Short[] { DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT, DecorationPaymentPO.PAYMENTSTATUS_PAY_INT, DecorationPaymentPO.PAYMENTSTATUS_CONFIRM_INT };

		List<DecorationPaymentPO> decorationPaymentPOs = decorationPaymentDao.queryDecorationPaymentByOrderId(decorationPO.getOrderId(), paymentStatus, DecorationPaymentPO.ONETYPE_ADD_INT, DecorationPaymentPO.TWOTYPE_DEAL_INT);

		for (DecorationPaymentPO decorationPayment : decorationPaymentPOs) {

			if (decorationPayment.getSort() == 0) continue;

			if (decorationPayment.getPaymentStatus() != DecorationPaymentPO.PAYMENTSTATUS_UNPAY_INT) {
				payTotal = Arith.add(payTotal, decorationPayment.getReferMoney());
			}

			factPrice = Arith.add(factPrice, decorationPayment.getReferMoney());
		}

		long payScale = factPrice != 0 ? Arith.mul(Arith.div(payTotal, factPrice), 100) : 0;

		decorationPO.setPaySacle((short) (payScale > 100 ? 100 : payScale));

		decorationDao.update(decorationPO);

		decorationAccountStatusService.updateDecorationAccountStatus(decorationPO.getOrderId());
	}

	@Override
	public void updateDecorationForSaleScale(DecorationVO decorationVO) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(decorationVO.getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		String orderId = decorationPO.getOrderId();

		long saleTotal = 0;
		long priceTotal = 0;

		salesPaymentDao.flush();

		saleTotal = salesPaymentDao.amountSalesPayment(orderId);

		AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

		// 上游 collectPayment 等通过 increaseAdvancePayment 原生SQL更新余额, 绕过Hibernate,
		// 若同一事务内 advancePaymentPO 仍在Session缓存中, 这里会读到旧值导致 saleScale 计算错误.
		// refresh 强制从DB重新加载, 保证读到原子SQL更新后的最新余额.
		if (advancePaymentPO != null) {
			advancePaymentDao.refresh(advancePaymentPO);
		}

		saleTotal = Arith.add(saleTotal, advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0);

		saleTotal = Arith.add(saleTotal, oalesDao.amountOales(orderId, OalesPO.ISSCALE_SCALE_INT));

		if (decorationPO.getType() == DecorationPO.TYPE_MIDPACK_INT) {

			DecorationMidpackPO decorationMidpackPO = decorationMidpackDao.queryDecorationMidpack(orderId);

			if (decorationMidpackPO != null) {

				priceTotal = decorationMidpackPO.getMaterialPrice();
				decorationMidpackPO.setMaterialPaidup(saleTotal);

				decorationMidpackDao.update(decorationMidpackPO);
			}

		} else if (decorationPO.getType() == DecorationPO.TYPE_HOLONOMY_INT) {

			DecorationHolonomyPO decorationHolonomyPO = decorationHolonomyDao.queryDecorationHolonomyByOrderId(orderId);

			if (decorationHolonomyPO != null) {

				priceTotal = decorationHolonomyPO.getMaterialPrice();
				decorationHolonomyPO.setMaterialPaidup(saleTotal);

				decorationHolonomyDao.update(decorationHolonomyPO);
			}
		}

		short saleScale = (short) (priceTotal != 0 ? Arith.mul(Arith.div(saleTotal, priceTotal), 100) : DecorationPO.TYPE_INIT_SALESCALE_INT);

		decorationPO.setSaleScale((short) (saleScale > 100 ? 100 : saleScale));

		decorationDao.update(decorationPO);

		decorationAccountStatusService.updateDecorationAccountStatus(decorationPO.getOrderId());

	}
}
