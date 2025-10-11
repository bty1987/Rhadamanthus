package com.fanglin.customer.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.CustomerPhoneDao;
import com.fanglin.communion.po.CustomerPhonePO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.customer.dao.CppointDao;
import com.fanglin.customer.dao.CppointRecordDao;
import com.fanglin.customer.dao.MemberDao;
import com.fanglin.customer.po.CppointPO;
import com.fanglin.customer.po.CppointRecordPO;
import com.fanglin.customer.service.MemberService;
import com.fanglin.customer.vo.MemberActivityVO;
import com.fanglin.customer.vo.MemberGoodsVO;
import com.fanglin.customer.vo.MemberOrderItemVO;
import com.fanglin.customer.vo.MemberOrderVO;
import com.fanglin.customer.vo.MemberPointVO;
import com.fanglin.customer.vo.MemberVO;
import com.fanglin.decoration.dao.DecorationActivityDao;
import com.fanglin.decoration.dao.DecorationActivityItemDao;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.dao.DecorationInfoDao;
import com.fanglin.decoration.po.DecorationActivityItemPO;
import com.fanglin.decoration.po.DecorationActivityPO;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.ActivityDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.ActivityPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.dao.CompanyDao;
import com.fanglin.system.po.CompanyPO;
import com.fanglin.system.service.impl.CompanyServiceImpl;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.FormatUtil;

@Service("memberservice")
@Transactional(readOnly = true)
public class MemberServiceImpl implements MemberService {

	@Autowired
	private MemberDao memberDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private CustomerPhoneDao customerPhoneDao;

	@Autowired
	private DecorationInfoDao decorationInfoDao;

	@Autowired
	private DecorationActivityDao decorationActivityDao;

	@Autowired
	private DecorationActivityItemDao decorationActivityItemDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private ActivityDao activityDao;

	@Autowired
	private CppointDao cppointDao;

	@Autowired
	private CppointRecordDao cppointRecordDao;

	@Autowired
	private CompanyDao companyDao;

	@Override
	public List<MemberVO> queryMember(MemberVO memberVO) throws FLException {

		List<MemberVO> memberVOs = new ArrayList<MemberVO>();

		List<Integer> companyIds = new ArrayList<Integer>();

		List<Long> customerIds = new ArrayList<Long>();

		if (memberVO.getPhone() == null) {
			return memberVOs;
		}

		List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByPhone(FormatUtil.encodePhone(memberVO.getPhone()), CustomerPhonePO.STATUS_ENABLE_INT, null);

		if (customerPhones == null || customerPhones.size() == 0) {
			throw new FLException(130006, "客户电话不存在");
		}

		for (CustomerPhonePO customerPhonePO : customerPhones) {
			customerIds.add(customerPhonePO.getCid());
		}

		if (customerIds == null || customerIds.size() == 0) {
			throw new FLException(130006, "客户电话不存在");
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerIds(customerIds);

		for (DecorationPO decorationPO : decorationPOs) {

			companyIds.add(decorationPO.getCompany());
		}

		if (companyIds == null || companyIds.size() == 0) {
			throw new FLException(130006, "客户公司不存在");
		}

		Map<Integer, String> companyMap = new HashMap<Integer, String>();

		List<CompanyPO> companyPOs = companyDao.queryCompanyByIds(companyIds);

		for (CompanyPO companyPO : companyPOs) {
			companyMap.put(companyPO.getCid(), companyPO.getName());
		}

		for (DecorationPO decorationPO : decorationPOs) {
			memberVOs.add(new MemberVO().init(decorationPO, companyMap.get(decorationPO.getCompany())));
		}

		return memberVOs;
	}

	@Override
	public List<MemberPointVO> queryMemberPoint(List<MemberPointVO> memberPointVOs) {

		List<MemberPointVO> memberPointFOs = memberPointVOs.subList(0, Math.min(10, memberPointVOs.size()));

		for (MemberPointVO memberPointVO : memberPointFOs) {

			String orderId = memberPointVO.getOrderId();

			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

			if (decorationPO == null) continue;

			long amount = cppointDao.amountCppoint(orderId);

			long dpoint = 0l;
			long spoint = 0l;
			long point = 0l;

			dpoint = memberDao.amountMemberPointForDecoration(orderId);
			spoint = memberDao.amountMemberPointForMaterial(orderId);

			memberPointVO.setDecorationPoint(Arith.mul(Arith.sub(dpoint, amount), 1l));
			memberPointVO.setMaterialPoint(Arith.mul(Arith.sub(spoint, 0), 1l));

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(orderId);

			memberPointVO.setFreezeDecorationPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getBalance() : 0, Arith.sub(memberDao.totalMemberPointForDecoration(orderId), dpoint)), 1l));
			memberPointVO.setFreezeMaterialPoint(Arith.mul(Arith.add(advancePaymentPO != null ? advancePaymentPO.getMaterialBalance() : 0, Arith.sub(memberDao.totalMemberPointForMaterial(orderId), spoint)), 1l));

			CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

			if (cppointPO != null) {
				point = Arith.mul(cppointPO.getPoint(), 1l);
			} else {
				point = Arith.add(memberPointVO.getDecorationPoint(), memberPointVO.getMaterialPoint());
			}

			memberPointVO.setOperatePoint(point);
		}

		return memberPointVOs;
	}

	@Override
	public List<MemberVO> queryMemberForInfo(MemberVO memberVO, Integer company) throws FLException {

		if (memberVO == null) {
			throw new FLException(130021, "客户电话不存在");
		}

		if (memberVO.getPhone() == null) {
			throw new FLException(130021, "客户电话不存在");
		}

		CustomerPhonePO customerPhonePO = customerPhoneDao.queryCustomerPhoneForDefault(FormatUtil.encodePhone(memberVO.getPhone()), company);

		if (customerPhonePO == null) {
			throw new FLException(130021, "客户电话不存在");
		}

		List<DecorationPO> decorationPOs = decorationDao.queryDecorationByCustomerId(customerPhonePO.getCid());
		List<DecorationPO> decorationAOs = new ArrayList<DecorationPO>();

		for (DecorationPO decorationPO : decorationPOs) {

			List<DecorationPO> chanceRefer = decorationInfoDao.queryDecorationForChanceRefer(decorationPO.getOrderId());

			if (chanceRefer != null) {
				decorationAOs.addAll(chanceRefer);
			}

			List<DecorationPO> originRefer = decorationInfoDao.queryDecorationForOriginRefer(decorationPO.getOrderId());

			if (originRefer != null) {
				decorationAOs.addAll(originRefer);
			}

			List<DecorationPO> orderRefer = decorationInfoDao.queryDecorationForOrderReferd(decorationPO.getOrderId());

			if (orderRefer != null) {
				decorationAOs.addAll(orderRefer);
			}
		}

		List<MemberVO> memberROs = new ArrayList<MemberVO>();

		for (DecorationPO decorationPO : decorationAOs) {

			MemberVO member = new MemberVO();

			List<CustomerPhonePO> customerPhones = customerPhoneDao.queryCustomerPhoneByCid(decorationPO.getCustomer().getCid(), CustomerPhonePO.STATUS_ENABLE_INT);

			if (!customerPhones.isEmpty()) {
				member.setPhone(FormatUtil.decodePhone(customerPhones.get(0).getPhone()));
			}

			member.setStoreTime(decorationPO.getCreateTime());

			member.setOrderId(decorationPO.getOrderId());

			member.setContractTime(decorationPO.getContractTime());

			memberROs.add(member);
		}

		return memberROs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMemberActivity(MemberActivityVO memberActivityVO, List<String> companys, String userId) throws FLException {

		UserPO creater = userDao.queryUserByUserId(userId);

		if (companys == null) companys = Arrays.asList(CompanyServiceImpl.encode(CompanyPO.TYPE_HEADQUARTER_INT));

		for (String company : companys) {

			ActivityPO activityPO = null;

			short decotype = 0;
			short saletype = 0;

			if (memberActivityVO.getType() == 0) {
				decotype = 1;
			}

			if (memberActivityVO.getType() == 1) {
				saletype = 1;
			}

			if (memberActivityVO.getType() == 2) {
				decotype = 1;
				saletype = 1;
			}

			if (decotype == 1) {

				activityPO = new ActivityPO();

				BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

				activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				activityPO.setCreater(creater);

				activityPO.setCompany(CompanyServiceImpl.decode(company));
				activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);

				activityPO.setDefaults(ActivityPO.TYPE_DECORATION_INT);
				activityPO.setMultiple(memberActivityVO.getMultiple());
				activityPO.setAtttype(ActivityPO.ATTTYPE_ONLINE_INT);

				activityDao.save(activityPO);
			}

			if (saletype == 1) {

				activityPO = new ActivityPO();

				BeanUtil.copyProperties(memberActivityVO, activityPO, Arrays.asList("creater"));

				activityPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
				activityPO.setCreater(creater);
				activityPO.setCompany(CompanyServiceImpl.decode(company));

				activityPO.setDefaults(ActivityPO.DEFAULTS_COMMON_INT);

				activityPO.setDefaults(ActivityPO.TYPE_SALES_INT);
				activityPO.setMultiple(memberActivityVO.getMultiple());
				activityPO.setAtttype(ActivityPO.ATTTYPE_ONLINE_INT);

				activityDao.save(activityPO);
			}
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int makeMemberOrder(MemberOrderVO memberOrderVO, List<MemberOrderItemVO> memberOrderItemVOs, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		long amount = cppointDao.amountCppoint(orderId);

		long totald = memberDao.amountMemberPointForDecoration(orderId);
		long totals = memberDao.amountMemberPointForMaterial(orderId);
		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		if (Arith.add(Arith.sub(totald, amount), Arith.sub(totals, 0)) < Arith.mul(memberOrderVO.getPoint(), 1000000l)) {
			throw new FLException(330049, "积分不足");
		}

		List<DecorationActivityPO> decorationActivityPOs = decorationActivityDao.queryDecorationActivityByOrderId(orderId);

		UserPO creater = userDao.queryUserByUserId(userId);

		for (MemberOrderItemVO memberOrderItemVO : memberOrderItemVOs) {

			DecorationActivityItemPO decorationActivityItemPO = new DecorationActivityItemPO();

			AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberOrderItemVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

			decorationActivityItemPO.setOrderId(orderId);

			decorationActivityItemPO.setAid(decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0).getActivity().getAid() : 0);
			decorationActivityItemPO.setActivityName(decorationActivityPOs != null && decorationActivityPOs.size() != 0 ? decorationActivityPOs.get(0).getActivity().getName() : "");

			if (awardStockPO != null) decorationActivityItemPO.setAsid(awardStockPO.getAsId());

			decorationActivityItemPO.setActivityItemName(memberOrderItemVO.getName());
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_DELIVERY_INT);

			decorationActivityItemPO.setIsPrefor(DecorationActivityItemPO.ISPREFOR_UNCAL_INT);
			decorationActivityItemPO.setIsPayment(DecorationActivityItemPO.ISPAYMENT_UNCAL_INT);

			decorationActivityItemPO.setNo(memberOrderVO.getPointOrderId());
			decorationActivityItemPO.setAtttype(DecorationActivityItemPO.ATTTYPE_ONLINE_INT);
			decorationActivityItemPO.setNum((int) Arith.mul(memberOrderItemVO.getNum(), 1000000l));
			decorationActivityItemPO.setMoney((int) Arith.mul(memberOrderItemVO.getPoint(), 1000000l));
			decorationActivityItemPO.setCreater(creater);
			decorationActivityItemPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

			decorationActivityItemDao.save(decorationActivityItemPO);
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {

			cppointPO = new CppointPO();

			cppointPO.setCustomer(decorationPO.getCustomer());
			cppointPO.setOrderId(orderId);
			cppointPO.setCompany(decorationPO.getCompany());
		}

		cppointPO.setDpoint(Arith.sub(totald, amount));
		cppointPO.setSpoint(Arith.sub(totals, 0));
		cppointPO.setOpoint(totalo);

		cppointPO.setPoint(Arith.sub(Arith.add(cppointPO.getDpoint(), cppointPO.getSpoint()), Arith.mul(memberOrderVO.getPoint(), 1000000l)));
		cppointDao.saveOrUpdate(cppointPO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_USERUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int cancelMemberOrder(MemberOrderVO memberOrderVO, String userId) throws FLException {

		String orderId = memberOrderVO.getOrderId();

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(orderId);

		if (decorationPO == null) {
			throw new FLException(140013, "订单不存在");
		}

		CppointPO cppointPO = cppointDao.queryCppointByOrderId(orderId);

		if (cppointPO == null) {
			throw new FLException(330047, "积分不存在");
		}

		UserPO creater = userDao.queryUserByUserId(userId);

		List<DecorationActivityItemPO> decorationActivityItemPOs = decorationActivityItemDao.queryDecorationActivityItem(orderId, memberOrderVO.getPointOrderId());

		for (DecorationActivityItemPO decorationActivityItemPO : decorationActivityItemPOs) {

			decorationActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));
			decorationActivityItemPO.setState(DecorationActivityItemPO.STATUS_UNVALID_INT);

			decorationActivityItemDao.update(decorationActivityItemPO);
		}

		decorationActivityItemDao.flush();

		long totalo = Arith.mul(memberOrderVO.getSurplusPoint(), 1000000l);

		cppointPO.setOpoint(totalo);

		cppointPO.setPoint(Arith.add(cppointPO.getPoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l)));

		cppointDao.saveOrUpdate(cppointPO);

		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_DECORATION_INT, cppointPO.getPoint(), Arith.mul(memberOrderVO.getPoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));
		cppointRecordDao.save(new CppointRecordPO().init(cppointPO.getCustomer().getCid(), cppointPO.getCpid(), CppointRecordPO.TYPE_ADDUP_INT, CppointRecordPO.POINTTYPE_OPOINT_INT, cppointPO.getOpoint(), Arith.mul(memberOrderVO.getOperatePoint(), 1000000l), memberOrderVO.getPointOrderId(), memberOrderVO.getOrderId(), creater));

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMemberGoods(MemberGoodsVO memberGoodsVO) {

		AwardStockPO awardStockPO = awardStockDao.queryAwardStockByNo(memberGoodsVO.getNo(), CompanyPO.TYPE_HEADQUARTER_INT);

		if (awardStockPO == null) {

			awardStockPO = new AwardStockPO();

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
			awardStockPO.setCompany(CompanyPO.TYPE_HEADQUARTER_INT);
			awardStockPO.setFormat(memberGoodsVO.getCategory());

			awardStockDao.save(awardStockPO);
		} else {

			awardStockPO.setNo(memberGoodsVO.getNo());
			awardStockPO.setName(memberGoodsVO.getName());
			awardStockPO.setUnitPrice(Arith.mul(memberGoodsVO.getPoint(), 1000000));
			awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);

			awardStockDao.update(awardStockPO);
		}

		return 0;
	}

}
