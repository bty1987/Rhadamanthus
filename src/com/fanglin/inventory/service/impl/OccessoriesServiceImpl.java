package com.fanglin.inventory.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronizationAdapter;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import com.fanglin.common.po.CountingPO;
import com.fanglin.common.service.CountingService;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.material.dao.GoodsDao;
import com.fanglin.data.po.AoodsPO;
import com.fanglin.data.po.GoodsPO;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.information.po.MessagePO;
import com.fanglin.information.service.MessageService;
import com.fanglin.inventory.dao.OccessoriesChargeDao;
import com.fanglin.inventory.dao.OccessoriesDao;
import com.fanglin.inventory.dao.OccessoriesItemDao;
import com.fanglin.inventory.po.OccessoriesChargePO;
import com.fanglin.inventory.po.OccessoriesItemPO;
import com.fanglin.inventory.po.OccessoriesPO;
import com.fanglin.inventory.service.OccessoriesService;
import com.fanglin.inventory.vo.OccessoriesChargeVO;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.dao.SystemConfigDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.po.SystemConfigPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;
import com.fanglin.utils.Paging;

@Service("occessoriesService")
@Transactional(readOnly = true)
public class OccessoriesServiceImpl implements OccessoriesService {

	private static final Logger log = LoggerFactory.getLogger(OccessoriesServiceImpl.class);

	private static final String OCCESSORIES_DELIVE_MESSAGE_URL_STR = "https://service-erp.fanglin.vip/dingding/vue/index.html?agent=4921021#/manifest/occessories-detail?oid=%s";

	@Autowired
	private OccessoriesDao occessoriesDao;

	@Autowired
	private GoodsDao goodsDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private CountingService countingService;

	@Autowired
	private CompanyDao companyDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private OccessoriesItemDao occessoriesItemDao;

	@Autowired
	private OccessoriesChargeDao occessoriesChargeDao;

	@Autowired
	private MessageService messageService;

	@Autowired
	private SystemConfigDao systemConfigDao;

	@Override
	public void pageOccessories(Paging paging, List<Filter> filters, int company, OccessoriesVO occessories) {

		List<OccessoriesPO> occessoriesPOs = occessoriesDao.pageOccessories(paging, filters, occessories.getStatus(), company);

		List<OccessoriesVO> occessoriesVOs = new ArrayList<OccessoriesVO>();

		for (OccessoriesPO occessoriesPO : occessoriesPOs) {

			OccessoriesVO occessoriesVO = new OccessoriesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(occessoriesPO, occessoriesVO, Arrays.asList("decoration", "creater", "supervisor", "supplier", "deliver", "receiver", "balancer"));

			occessoriesVO.getCreater().setBaseInfo(occessoriesPO.getCreater());
			occessoriesVO.getSupervisor().setBaseInfo(occessoriesPO.getSupervisor());

			occessoriesVO.getSupplier().setBaseInfo(occessoriesPO.getSupplier());

			occessoriesPO.getDecoration().ptvcascade(occessoriesVO.getDecoration());

			occessoriesVOs.add(occessoriesVO);
		}

		paging.setData(occessoriesVOs);
	}

	@Override
	public void pageOccessoriesForSupplier(Paging paging, List<Filter> filters, String userId, OccessoriesVO occessories) {

		UserPO user = userDao.queryUserByUserId(userId);

		List<OccessoriesPO> occessoriesPOs = occessoriesDao.pageOccessoriesForSupplier(paging, filters, user.getUid());

		List<OccessoriesVO> occessoriesVOs = new ArrayList<OccessoriesVO>();

		for (OccessoriesPO occessoriesPO : occessoriesPOs) {

			OccessoriesVO occessoriesVO = new OccessoriesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

			BeanUtil.copyProperties(occessoriesPO, occessoriesVO, Arrays.asList("decoration", "creater", "supervisor", "supplier", "deliver", "receiver", "balancer"));

			occessoriesVO.getCreater().setBaseInfo(occessoriesPO.getCreater());
			occessoriesVO.getSupervisor().setBaseInfo(occessoriesPO.getSupervisor());
			occessoriesVO.getSupplier().setBaseInfo(occessoriesPO.getSupplier());

			occessoriesPO.getDecoration().ptvcascade(occessoriesVO.getDecoration());

			occessoriesVOs.add(occessoriesVO);
		}

		paging.setData(occessoriesVOs);
	}

	@Override
	public List<OccessoriesVO> queryOccessoriesByOrderId(OccessoriesVO occessoriesVO) {

		List<OccessoriesPO> occessoriesPOs = occessoriesDao.queryOccessoriesByOrderId(occessoriesVO.getDecoration().getOrderId());
		List<OccessoriesVO> occessoriesVOs = new ArrayList<OccessoriesVO>();

		for (OccessoriesPO occessoriesPO : occessoriesPOs) {

			occessoriesVO = new OccessoriesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());
			BeanUtil.copyProperties(occessoriesPO, occessoriesVO, Arrays.asList("decoration", "creater", "supervisor", "supplier", "deliver", "receiver", "balancer"));

			occessoriesVO.getCreater().setBaseInfo(occessoriesPO.getCreater());
			occessoriesVO.getSupervisor().setBaseInfo(occessoriesPO.getSupervisor());
			occessoriesVO.getSupplier().setBaseInfo(occessoriesPO.getSupplier());

			occessoriesPO.getDecoration().ptvcascade(occessoriesVO.getDecoration());

			occessoriesVOs.add(occessoriesVO);
		}

		return occessoriesVOs;
	}

	@Override
	public OccessoriesVO queryOccessoriesByOid(OccessoriesVO occessoriesVO) {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) return null;

		occessoriesVO = new OccessoriesVO(new DecorationVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO(), new UserBaseVO());

		BeanUtil.copyProperties(occessoriesPO, occessoriesVO, Arrays.asList("decoration", "creater", "supervisor", "supplier", "deliver", "receiver", "balancer"));

		occessoriesVO.getCreater().setBaseInfo(occessoriesPO.getCreater());
		occessoriesVO.getSupervisor().setBaseInfo(occessoriesPO.getSupervisor());
		occessoriesVO.getSupplier().setBaseInfo(occessoriesPO.getSupplier());

		occessoriesPO.getDecoration().ptvcascade(occessoriesVO.getDecoration());

		return occessoriesVO;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException {

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(occessoriesVO.getDecoration().getOrderId());

		if (decorationPO == null) {
			throw new FLException(140013, "装修单不存在");
		}

		if (decorationPO.getProjectStatus() == DecorationPO.PROJECTSTATUS_FINISH_INT) {
			throw new FLException(260089, "工程已验收,辅料已锁定");
		}

		int company = decorationPO.getCompany();

		CompanyPO companyPO = companyDao.get(company);

		if (companyPO == null) {
			throw new FLException(230015, "公司不存在");
		}

		String currentDate = DateUtil.current("yyMMdd").toString();
		int count = countingService.queryCountingByTypeDate(CountingPO.TYPE_INVENTORY_O_INT, currentDate, company);
		String no = companyPO.getShortname() + currentDate + FormatUtil.fillZero(FormatUtil.offset(count), "0000");

		UserPO creater = userDao.queryUserByUserId(userId);

		OccessoriesPO occessoriesPO = new OccessoriesPO().init(no, occessoriesVO.getDecoration().getOrderId(), creater, company, occessoriesVO.getIsEnter(), occessoriesVO.getIsLift(), occessoriesVO.getIsExceed(), occessoriesVO.getIsAttic(), occessoriesVO.getLoadFloor());

		if (occessoriesVO.getSupervisor() != null) {
			occessoriesPO.setSupervisor(userDao.queryUserByUserId(occessoriesVO.getSupervisor().getUserId()));
		}

		occessoriesPO.setDecoration(decorationPO);
		occessoriesPO.setComment(occessoriesVO.getComment());

		occessoriesDao.save(occessoriesPO);

		// 计算外辅费用总额和商品总额
		long totalCharge = 0; // 费用总额
		long total = 0; // 商品总额 = ∑(数量 × 单价)
		int totalBalance = 0; // 结算总额 = ∑(结算价)

		for (OccessoriesItemVO occessoriesItemVO : OccessoriesItemVOs) {

			OccessoriesItemPO occessoriesItemPO = new OccessoriesItemPO().init(occessoriesPO.getOid(), occessoriesItemVO.getGoods().getGid(), occessoriesItemVO.getNum());
			occessoriesItemPO.setRbalance(occessoriesItemVO.getRbalance());
			occessoriesItemPO.setVbalance(occessoriesItemVO.getRbalance());

			// 设置 nid（定材ID）
			if (occessoriesItemVO.getNid() != null && occessoriesItemVO.getNid() > 0) {
				occessoriesItemPO.setNid(occessoriesItemVO.getNid());
			}

			// 设置 surplus（浮动额）
			if (occessoriesItemVO.getSurplus() != null) {
				occessoriesItemPO.setSurplus(occessoriesItemVO.getSurplus());
			}

			// 计算结算总额：数量 × 单价（使用 Arith 精确运算）
			int rbalance = occessoriesItemVO.getRbalance() != null ? occessoriesItemVO.getRbalance() : 0;
			int num = occessoriesItemVO.getNum() != null ? occessoriesItemVO.getNum() : 0;
			int itemBalance = Arith.mul(rbalance, num);

			totalBalance = Arith.add(totalBalance, itemBalance);

			// 设置 aoods 关联
			if (occessoriesItemVO.getAoods() != null && occessoriesItemVO.getAoods().getAid() != null) {
				occessoriesItemPO.setAoods(new AoodsPO(occessoriesItemVO.getAoods().getAid()));
			}

			occessoriesItemDao.save(occessoriesItemPO);

			// 累计商品总额：数量 × 单价（商品单价取商品档案实价，itemPO.goods 仅持有 gid）
			GoodsPO goodsPO = goodsDao.get(occessoriesItemVO.getGoods().getGid());

			total = Arith.add(total, Arith.mul(occessoriesItemPO.getNum(), goodsPO.getSelling()));

			if (occessoriesItemVO.getOccessoriesCharges() == null || occessoriesItemVO.getOccessoriesCharges().size() == 0) continue;

			long itemCharge = 0; // 计算当前 item 的外辅费用总额

			for (OccessoriesChargeVO occessoriesChargeVO : occessoriesItemVO.getOccessoriesCharges()) {

				if (occessoriesChargeVO.getNum() == null || occessoriesChargeVO.getNum() == 0) continue;

				OccessoriesChargePO occessoriesChargePO = new OccessoriesChargePO();
				occessoriesChargePO.setOccessories(occessoriesPO);
				occessoriesChargePO.setOccessoriesItem(occessoriesItemPO);
				occessoriesChargePO.setName(occessoriesChargeVO.getName());
				occessoriesChargePO.setPrice(occessoriesChargeVO.getPrice());
				occessoriesChargePO.setSurplus(occessoriesChargeVO.getSurplus() != null ? occessoriesChargeVO.getSurplus() : 0);
				occessoriesChargePO.setNum(occessoriesChargeVO.getNum() != null ? occessoriesChargeVO.getNum() : 0);
				occessoriesChargeDao.save(occessoriesChargePO);

				// 累计费用：根据 isExceed 判断 surplus 是否参与运算（使用 Arith 精确运算）
				// isExceed == 0 时（超阶），surplus 参与运算；否则不参与
				int price = occessoriesChargeVO.getPrice() != null ? occessoriesChargeVO.getPrice() : 0;
				int surplus = occessoriesChargeVO.getSurplus() != null ? occessoriesChargeVO.getSurplus() : 0;
				int inum = occessoriesChargeVO.getNum() != null ? occessoriesChargeVO.getNum() : 0;

				long chargeAmount = Arith.mul(Arith.add(price, occessoriesPO.getIsExceed() == OccessoriesPO.ISEXCEED_EXCEED_INT ? surplus : 0), inum);

				itemCharge = Arith.add(itemCharge, chargeAmount);
				totalCharge = Arith.add(totalCharge, chargeAmount);
			}

			// 更新当前 item 的费用总额
			occessoriesItemPO.setCharge(itemCharge);

			occessoriesItemDao.update(occessoriesItemPO);
		}

		// 更新外辅单总额、费用总额和结算额
		occessoriesPO.setTotal(total);
		occessoriesPO.setCharge(totalCharge);
		occessoriesPO.setRcharge(totalCharge);
		occessoriesPO.setRbalance(totalBalance);
		occessoriesPO.setVbalance(totalBalance);

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int bindOccessories(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT && occessoriesPO.getStatus() != OccessoriesPO.STATUS_BIND_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		occessoriesPO.setSupplier(userDao.get(occessoriesVO.getSupplier().getUid()));
		occessoriesPO.setStatus(OccessoriesPO.STATUS_BIND_INT);

		occessoriesDao.update(occessoriesPO);

		final UserPO supervisor = occessoriesPO.getSupervisor();

		if (supervisor != null) {

			final String content = String.format("装修单号:%s,楼盘:%s,外辅单号:%s,厂商名称:%s,已经分配完厂商", occessoriesPO.getDecoration().getOrderId(), occessoriesPO.getDecoration().getHouse().getVillage().getName(), occessoriesPO.getNo(), occessoriesPO.getSupplier().getUserName());

			sendMessageAfterCommit(new Runnable() {

				public void run() {
					messageService.sendMessage(supervisor.getUserId(), null, content, MessagePO.TYPE_SEND_CONSTRUCTION_INT, supervisor.getCompany());
				}
			});
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> OccessoriesItemVOs, String userId) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());
		UserPO deliver = userDao.queryUserByUserId(userId);

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_BIND_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}
		occessoriesPO.setDeliver(deliver);
		occessoriesPO.setStatus(OccessoriesPO.STATUS_DELIVE_INT);
		occessoriesPO.setDeliveTime(DateUtil.getDateToTimestamp(new Date()));
		occessoriesPO.setContent(occessoriesVO.getContent());

		occessoriesDao.update(occessoriesPO);

		for (OccessoriesItemVO occessoriesItemVO : OccessoriesItemVOs) {

			OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());

			if (occessoriesItemPO == null) {
				throw new FLException(260075, "外辅项不存在");
			}

			occessoriesItemPO.setSennum(occessoriesItemVO.getSennum());

			occessoriesItemDao.save(occessoriesItemPO);
		}

		final UserPO supervisor = occessoriesPO.getSupervisor();

		if (supervisor != null) {

			final String content = String.format("装修单号:%s,楼盘:%s,外辅单号:%s,厂商名称:%s,已经送货", occessoriesPO.getDecoration().getOrderId(), occessoriesPO.getDecoration().getHouse().getVillage().getName(), occessoriesPO.getNo(), occessoriesPO.getSupplier().getUserName());
			final UserPO deliverFinal = deliver;
			final String messageUrl = buildOccessoriesDeliveMessageUrl(occessoriesPO);

			sendMessageAfterCommit(new Runnable() {

				public void run() {
					messageService.sendMessageForUrl(supervisor.getUserId(), deliverFinal == null ? null : deliverFinal.getUserId(), content, MessagePO.TYPE_SEND_CONSTRUCTION_INT, messageUrl, supervisor.getCompany());
				}
			});
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveOccessories(OccessoriesVO occessoriesVO, List<OccessoriesItemVO> occessoriesItemVOs, String userId) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());
		UserPO receiver = userDao.queryUserByUserId(userId);

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_DELIVE_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		occessoriesPO.setReceiver(receiver);
		occessoriesPO.setStatus(OccessoriesPO.STATUS_RECEIVE_INT);
		occessoriesPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		occessoriesDao.update(occessoriesPO);

		for (OccessoriesItemVO occessoriesItemVO : occessoriesItemVOs) {

			OccessoriesItemPO occessoriesItemPO = occessoriesItemDao.get(occessoriesItemVO.getOiid());

			if (occessoriesItemPO == null) {
				throw new FLException(260075, "外辅项不存在");
			}

			occessoriesItemPO.setRecnum(occessoriesItemVO.getRecnum());

			occessoriesItemDao.save(occessoriesItemPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesForBalance(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_RECEIVE_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		// 仅更新虚结算额和结算费用，不改变状态
		occessoriesPO.setVbalance(occessoriesVO.getVbalance() != null ? occessoriesVO.getVbalance() : 0);
		occessoriesPO.setRcharge(occessoriesVO.getRcharge() != null ? occessoriesVO.getRcharge() : 0);

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int balanceOccessories(OccessoriesVO occessoriesVO, String userId) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_RECEIVE_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		UserPO user = userDao.queryUserByUserId(userId);

		// 仅更新结算状态、结算人、结算时间
		occessoriesPO.setStatus(OccessoriesPO.STATUS_BALANCE_INT);
		occessoriesPO.setBalancer(user);
		occessoriesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int batchBalanceOccessories(List<OccessoriesVO> occessoriess, String userId) throws FLException {

		UserPO user = userDao.queryUserByUserId(userId);

		for (OccessoriesVO occessoriesVO : occessoriess) {

			OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

			if (occessoriesPO == null) {
				throw new FLException(260023, "辅料单不存在");
			}

			if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_RECEIVE_INT) {
				throw new FLException(260024, "辅料单状态不可操作");
			}

			occessoriesPO.setStatus(OccessoriesPO.STATUS_BALANCE_INT);
			occessoriesPO.setBalancer(user);
			occessoriesPO.setBalanceTime(DateUtil.getDateToTimestamp(new Date()));

			occessoriesDao.update(occessoriesPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rejectOccessories(OccessoriesVO occessoriesVO, String userId) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_BALANCE_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		occessoriesPO.setStatus(OccessoriesPO.STATUS_RECEIVE_INT);
		occessoriesPO.setBalancer(null);
		occessoriesPO.setBalanceTime(null);
		occessoriesPO.setVbalance(0);
		occessoriesPO.setRcharge(0);

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int finishOccessories(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_BALANCE_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		occessoriesPO.setStatus(OccessoriesPO.STATUS_FINISH_INT);
		occessoriesPO.setFinishTime(DateUtil.getDateToTimestamp(new Date()));

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int rateOccessories(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		occessoriesPO.setRate(occessoriesVO.getRate());
		occessoriesPO.setRemake(occessoriesVO.getRemake());

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateOccessoriesForRemark(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		occessoriesPO.setRemark(occessoriesVO.getRemark());

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelOccessories(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() >= OccessoriesPO.STATUS_RECEIVE_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		occessoriesPO.setStatus(OccessoriesPO.STATUS_CANCEL_INT);

		occessoriesDao.update(occessoriesPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deleteOccessories(OccessoriesVO occessoriesVO) throws FLException {

		OccessoriesPO occessoriesPO = occessoriesDao.get(occessoriesVO.getOid());

		if (occessoriesPO == null) {
			throw new FLException(260023, "辅料单不存在");
		}

		if (occessoriesPO.getStatus() != OccessoriesPO.STATUS_INIT_INT) {
			throw new FLException(260024, "辅料单状态不可操作");
		}

		occessoriesDao.delete(occessoriesPO);

		return 0;
	}

	private String buildOccessoriesDeliveMessageUrl(OccessoriesPO occessoriesPO) {

		SystemConfigPO messageUrl = systemConfigDao.querySystemConfig("occessoriesDeliveMessageUrl", occessoriesPO.getCompany());

		if (messageUrl == null) {
			messageUrl = systemConfigDao.querySystemConfig("occessoriesDeliveMessageUrl", 0);
		}

		String value = messageUrl == null ? OCCESSORIES_DELIVE_MESSAGE_URL_STR : messageUrl.value(OCCESSORIES_DELIVE_MESSAGE_URL_STR);

		return String.format(value, occessoriesPO.getOid());
	}

	// 钉钉消息延后到事务提交后发送，避免 HTTP 超时拖长事务；发送失败只记日志不回滚业务
	private void sendMessageAfterCommit(final Runnable task) {

		if (!TransactionSynchronizationManager.isSynchronizationActive()) {
			task.run();
			return;
		}

		TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {

			@Override
			public void afterCommit() {
				try {
					task.run();
				} catch (Exception e) {
					log.error("occessories message send after commit failed", e);
				}
			}
		});
	}

}
