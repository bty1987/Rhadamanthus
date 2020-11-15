/**
 * @File Name		: MaterialPaymentServiceImpl.java
 * @Package   	: com.fanglin.service.impl.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-10-7
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.common.dao.ServiceRecordDao;
import com.fanglin.common.po.ServiceRecordPO;
import com.fanglin.communion.dao.CustomerDao;
import com.fanglin.communion.po.CustomerPO;
import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.HouseVO;
import com.fanglin.communion.vo.VillageVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.service.DecorationService;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.dao.MaterialItemDao;
import com.fanglin.material.dao.MaterialRefundDao;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.material.po.MaterialRefundPO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.payment.dao.AdvancePaymentDao;
import com.fanglin.payment.dao.MaterialPaymentDao;
import com.fanglin.payment.dao.MaterialReceiptDao;
import com.fanglin.payment.po.AdvancePaymentPO;
import com.fanglin.payment.po.MaterialPaymentPO;
import com.fanglin.payment.po.MaterialReceiptPO;
import com.fanglin.payment.po.PaymentPO;
import com.fanglin.payment.po.PointofsalesPO;
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.service.MaterialPaymentService;
import com.fanglin.payment.service.PointofsalesService;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.MaterialReceiptVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.system.vo.CityProperVO;
import com.fanglin.system.vo.CityVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("materialPaymentService")
@Transactional(readOnly=true)
public class MaterialPaymentServiceImpl implements MaterialPaymentService {

	@Autowired
	private MaterialPaymentDao materialPaymentDao;

	@Autowired
	private MaterialReceiptDao materialReceiptDao;

	@Autowired
	private AdvancePaymentDao advancePaymentDao;

	@Autowired
	private AdvancePaymentService advancePaymentService;
	
	@Autowired
	private MaterialDao materialDao;

	@Autowired
	private MaterialRefundDao materialRefundDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private CustomerDao customerDao;

	@Autowired
	private DecorationDao decorationDao;

	@Autowired
	private ServiceRecordDao serviceRecordDao;
	
	@Autowired
	private DecorationService decorationService;
	
	@Autowired
	private MaterialItemDao materialItemDao;
	
	@Autowired
	private PointofsalesService pointofsalesService;

	@Override
	public void pageMaterialPayment(Paging paging, List<Filter> filters, MaterialPaymentVO materialPayment, int company){

		if(filters.size() == 0) return;

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		filters.add(new Filter("company", String.valueOf(company), "eq"));
		
		if (materialPayment != null) materialPayment.filter(filters);

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPayment(paging, filters);

		MaterialPaymentVO materialPaymentVO;

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			materialPaymentVO = new MaterialPaymentVO(new MaterialVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))),new CustomerVO()),new UserBaseVO());

			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			
			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			}
			
			BeanUtil.copyProperties(materialPaymentPO.getCreater(), materialPaymentVO.getCreater(), Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), materialPaymentVO.getMaterial(), Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getCustomer(), materialPaymentVO.getMaterial().getCustomer());
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse(), materialPaymentVO.getMaterial().getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage(), materialPaymentVO.getMaterial().getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage().getCityProper(), materialPaymentVO.getMaterial().getHouse().getVillage().getCityProper(), Arrays.asList("city"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage().getCityProper().getCity(), materialPaymentVO.getMaterial().getHouse().getVillage().getCityProper().getCity(), Arrays.asList("region"));
			
			MaterialReceiptPO materialReceipt = materialPaymentPO.getMaterialReceipt();
			
			if(materialReceipt != null){
				materialPaymentVO.setCollecter(new UserBaseVO());
				BeanUtil.copyProperties(materialReceipt.getCollecter(), materialPaymentVO.getCollecter(),Arrays.asList("dept","duty"));
				
				if(materialReceipt.getConfirmer() != null){
					materialPaymentVO.setConfirmer(new UserBaseVO());
					BeanUtil.copyProperties(materialReceipt.getConfirmer(), materialPaymentVO.getConfirmer(), Arrays.asList("dept","duty"));
				}
			}
			
			materialPaymentVOs.add(materialPaymentVO);
		}

		paging.setData(materialPaymentVOs);
	}

	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentByOrderId(MaterialPaymentVO materialPaymentVO, List<Filter> filters, int company) {

		String orderId = materialPaymentVO.getMaterial().getOrderId();
		String no = materialPaymentVO.getMaterial().getNo();
		Short paymentstatus = materialPaymentVO.getPaymentStatus();
		
		if(orderId == "" && no == "") return null;
		
		if(orderId != null && orderId != ""){
			filters.add(new Filter(MaterialPaymentPO.COLUMN_ORDERID_STR, orderId, "eq"));
		}
		
		if(no != null && no != ""){
			filters.add(new Filter(MaterialPaymentPO.COLUMN_NO_STR, no, "eq"));
		}
		
		if(paymentstatus != null){
			filters.add(new Filter(MaterialPaymentPO.COLUMN_PAYMENTSTATUS_STR, String.valueOf(paymentstatus), "eq"));
		}

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByOrderId(filters);

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			MaterialPaymentVO _materialPaymentVO = new MaterialPaymentVO(new MaterialVO(new HouseVO(new VillageVO(new CityProperVO(new CityVO()))),new CustomerVO()),new UserBaseVO());

			BeanUtil.copyProperties(materialPaymentPO, _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			}
			
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), _materialPaymentVO.getMaterial(), Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));
			BeanUtil.copyProperties(materialPaymentPO.getCreater(), _materialPaymentVO.getCreater(), Arrays.asList("dept", "duty"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getCustomer(), _materialPaymentVO.getMaterial().getCustomer());
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse(), _materialPaymentVO.getMaterial().getHouse(), Arrays.asList("village"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage(), _materialPaymentVO.getMaterial().getHouse().getVillage(), Arrays.asList("cityProper"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage().getCityProper(), _materialPaymentVO.getMaterial().getHouse().getVillage().getCityProper(), Arrays.asList("city"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage().getCityProper().getCity(), _materialPaymentVO.getMaterial().getHouse().getVillage().getCityProper().getCity(), Arrays.asList("region"));

			materialPaymentVOs.add(_materialPaymentVO);
		}

		return materialPaymentVOs;
	}

	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentByMid(MaterialPaymentVO materialPaymentVO){
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMid(materialPaymentVO.getMaterial().getMid(), null);
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			MaterialPaymentVO _materialPaymentVO = new MaterialPaymentVO(new MaterialVO());
			BeanUtil.copyProperties(materialPaymentPO, _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), _materialPaymentVO.getMaterial(),Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			}

			materialPaymentVOs.add(_materialPaymentVO);
		}

		return materialPaymentVOs;
	}


	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentForNotInitByMrId(MaterialReceiptVO materialReceiptVO) {

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentForNotInitByMrId(materialReceiptVO.getMrId());
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			MaterialPaymentVO materialPaymentVO = new MaterialPaymentVO();
			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));
			}
			
			UserPO collecterUser = materialPaymentPO.getMaterialReceipt().getCollecter();
			if(collecterUser != null){
				materialPaymentVO.setCollecter(new UserBaseVO());
				BeanUtil.copyProperties(collecterUser, materialPaymentVO.getCollecter(), Arrays.asList("duty","dept"));
			}

			materialPaymentVOs.add(materialPaymentVO);
		}

		return materialPaymentVOs;
	}

	@Override
	public void checkMaterialPayment(MaterialPaymentVO materialPaymentVO) throws FLException{

		MaterialPaymentPO materialPayment = materialPaymentDao.get(materialPaymentVO.getMpId());

		if(materialPayment.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			throw new FLException(150008, "款项不能进行收款");
		}

	}
	
	//生成定金主材款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMaterialPaymentForDeposit(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();

		MaterialPO materialPO = materialDao.get(msoId);

		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}

		if(materialPaymentVO.getReferMoney() < 0){
			throw new FLException(150025, "款项金额不正确");
		}
		
		//当前主材单不能有任何款项信息
		List<MaterialPaymentPO>  materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(msoId, null);
		if(materialPaymentPOs.size() > 0){
			throw new FLException(150029, "款项不可提交");
		}

		//api上错误信息是: 150029, "款项不可提交", 暂时先保留原本信息
		if(materialPaymentDao.countMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT) > 0){
			throw new FLException(150033, "款项类型已存在");
		}

		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		BeanUtil.copyProperties(materialPaymentVO, materialPaymentPO, Arrays.asList("materialReceipt", "material", "creater"));

		materialPaymentPO.setMaterial(materialPO);
		materialPaymentPO.setCategory(materialPO.getCategory());
		materialPaymentPO.setBrand(materialPO.getBrand());
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);

		UserPO userPO = userDao.queryUserByUserId(userId);
		materialPaymentPO.setCreater(userPO);
		materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		materialPaymentPO.setCompany(materialPO.getCompany());
		
		materialPO.setDepositPayment(materialPaymentPO.getReferMoney());
		materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT);
		materialDao.update(materialPO);

		materialPaymentDao.save(materialPaymentPO);

	}
	
	//生成补款主材款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMaterialPaymentForFullpay(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();

		MaterialPO materialPO = materialDao.get(msoId);
		
		if(materialPaymentDao.countMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);
		
		if(materialPaymentPOs.size() > 0){
			MaterialPaymentPO depositMaterialPaymentPO = materialPaymentPOs.get(0);
			if(depositMaterialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
				throw new FLException(150041, "定金状态不可操作");
			}
		}
		
		long couponValue = materialPO.getCoupon();
		long venderMalingValue = materialPO.getVenderMaling();
		long subMaterialMoney = Arith.add(couponValue, venderMalingValue);
		long sumMaterialMoney = Arith.add(materialPaymentPOs.size() == 0 ? 0 : materialPaymentPOs.get(0).getReferMoney(), materialPaymentVO.getReferMoney());
		
		if(materialPO.getTotal() != Arith.add(subMaterialMoney, sumMaterialMoney)){
			throw new FLException(150017, "项目总额与款项额不符");
		}
		
		if(materialPO.getTotal() != materialItemDao.amountMaterialItemForTotal(msoId)){
			throw new FLException(150017, "项目总额与款项额不符");
		}

		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		BeanUtil.copyProperties(materialPaymentVO, materialPaymentPO, Arrays.asList("materialReceipt", "material", "creater"));

		materialPaymentPO.setMaterial(materialPO);
		materialPaymentPO.setCategory(materialPO.getCategory());
		materialPaymentPO.setBrand(materialPO.getBrand());
		
		if(materialPaymentVO.getReferMoney() >= 0){
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT);
		}else if(materialPaymentVO.getReferMoney() < 0){
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT);
		}
		
		materialPaymentPO.setReferMoney(Math.abs(materialPaymentVO.getReferMoney()));
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		materialPaymentPO.setCreater(userPO);
		materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		materialPaymentPO.setCompany(materialPO.getCompany());
		
		materialPO.setFullPayment(materialPaymentVO.getReferMoney());
		materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT);
		
		materialPO.setNo(materialPO.getNo());

		materialDao.update(materialPO);

		materialPaymentDao.save(materialPaymentPO);

	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int changeMaterialPaymentForTime(MaterialPaymentVO materialPaymentVO, Timestamp dateTime, String userId) throws FLException{

		Timestamp oldDateTime = null;
		Timestamp oldConfirmTime = null;
		String paymentType = "";

		String msoNo = materialPaymentVO.getMaterial().getNo();
		short _paymentType = materialPaymentVO.getPaymentType();

		MaterialPaymentPO materialPaymentPO = materialPaymentDao.queryMaterialPaymentByMsoNoAType(msoNo, _paymentType);

		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();

		if(materialPaymentPO != null && (materialPaymentPO.getPaymentStatus() == 1 || materialPaymentPO.getPaymentStatus() == 2)){
			oldDateTime = materialReceiptPO.getCollectTime();

			materialReceiptPO.setCollectTime(dateTime);

			if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_STR;
			}else if(_paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT){
				paymentType = MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_STR;
			}
			
			if(materialReceiptPO.getConfirmTime() == null){
				throw new FLException(150036, "款项状态不可操作");
			}

			if(materialReceiptPO.getConfirmTime().before(dateTime)){
				oldConfirmTime = materialReceiptPO.getConfirmTime();

				materialReceiptPO.setConfirmTime(dateTime);
			}

			materialPaymentDao.update(materialPaymentPO);

			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_CHANGE_PAYMENT_INT);
			serviceRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
			serviceRecordPO.setOperateUserId(userId);

			if(oldConfirmTime != null){
				serviceRecordPO.setInfo(String.format("主材子订单编号:%s,修改款项类型:%s,原收款时间:%s,修改时间为:%s,原确认时间:", msoNo, paymentType, oldDateTime.toString(), dateTime, oldConfirmTime.toString()));
			}else{
				serviceRecordPO.setInfo(String.format("主材子订单编号:%s,修改款项类型:%s,原收款时间:%s,修改时间为:%s", msoNo, paymentType, oldDateTime.toString(), dateTime));
			}

			serviceRecordDao.saveOrUpdate(serviceRecordPO);
		}

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPayment(MaterialPaymentVO materialPaymentVO, List<Long> posids, String userId, Integer company) throws FLException{

		long realMoney = 0;

		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();

		int paymentType = materialPaymentPO.getPaymentType();
		
		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			materialReceiptPO.setType(MaterialReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}else{
			materialReceiptPO.setType(MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT);
		}

		Long advance = materialPaymentVO.getAdvance();

		if(materialPaymentVO.getAdvance() != null && materialPaymentVO.getAdvance() != 0){
			materialReceiptPO.setAdvance(materialPaymentVO.getAdvance());
			materialReceiptPO.setAdvanceType(materialPaymentVO.getAdvanceType());
			realMoney = Arith.add(materialPaymentVO.getAdvance(), realMoney);
		}

		if(materialPaymentVO.getCoupon() != null && materialPaymentVO.getCoupon() != 0){
			materialReceiptPO.setCoupon(materialPaymentVO.getCoupon());
			materialReceiptPO.setCouponInfo(materialPaymentVO.getCouponInfo());
			realMoney = Arith.add(materialPaymentVO.getCoupon(), realMoney);
		}

		if(materialPaymentVO.getCash() != null && materialPaymentVO.getCash() != 0){
			materialReceiptPO.setCash(materialPaymentVO.getCash());
			materialReceiptPO.setCashInfo(materialPaymentVO.getCashInfo());
			realMoney = Arith.add(materialPaymentVO.getCash(), realMoney);
		}
		if(materialPaymentVO.getBank() != null && materialPaymentVO.getBank() != 0){
			materialReceiptPO.setBank(materialPaymentVO.getBank());
			materialReceiptPO.setBankInfo(materialPaymentVO.getBankInfo());
			realMoney = Arith.add(materialPaymentVO.getBank(), realMoney);
		}
		if(materialPaymentVO.getCheckv() != null && materialPaymentVO.getCheckv() != 0){
			materialReceiptPO.setCheckv(materialPaymentVO.getCheckv());
			materialReceiptPO.setCheckvBank(materialPaymentVO.getCheckvBank());
			realMoney = Arith.add(materialPaymentVO.getCheckv(), realMoney);
		}

		if(materialPaymentPO.getReferMoney()!=realMoney){
			throw new FLException(150008, "款项不能进行收款");
		}


		materialReceiptPO.setComment(materialPaymentVO.getComment());
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);

		MaterialPO materialPO = materialPaymentPO.getMaterial();

		long count = 0;
		
		if(materialPO != null){
			if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
				materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);					
				count = Arith.add(count, materialPaymentPO.getReferMoney());
			}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType){
				materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);
				materialPO.setFullpayTime(materialReceiptPO.getCollectTime());
				count = Arith.add(Arith.add(count, materialPaymentPO.getReferMoney()), materialPO.getCoupon());
			}

			materialDao.update(materialPO);
		}

		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialReceiptPO.setCollecter(userPO);
			materialReceiptPO.setCollecterName(userPO.getCurrentName());
		}
		materialReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));

		materialPaymentPO.setMaterialReceipt(materialReceiptPO);
		materialPaymentPO.setCompany(company);

		materialReceiptDao.save(materialReceiptPO);
		materialPaymentDao.update(materialPaymentPO);
		
		if(materialPaymentVO.getAdvance() != null && materialPaymentVO.getAdvance() != 0){

			int advanceType = materialPaymentVO.getAdvanceType();
			long customerAdvance = 0;
			Short _paymentType = 0;

			CustomerPO customerPO = customerDao.get(materialPaymentPO.getMaterial().getCustomer().getCid());

			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(materialPO.getOrderId());

			if(advancePaymentPO == null){
				throw new FLException(150010, "预付款余额不足");
			}
			
			if(advancePaymentPO.getMaterialBalance() < materialPaymentVO.getAdvance()){
				throw new FLException(150010, "预付款余额不足");
			}

			if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_MATERIAL_INT){
				customerAdvance = advancePaymentPO.getMaterialBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_MATERIAL_INT;
			}else if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_ZATERIAL_INT){
				customerAdvance = advancePaymentPO.getZhenglinBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_ZHENGLIN_INT;
			}

			PaymentVO paymentVO  = new PaymentVO();

			String orderId = "";

			if(materialPO != null){
				orderId = materialPO.getOrderId();
			}

			paymentVO = PaymentServiceImpl.advancePaymentBalance(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR, advance, _paymentType, customerAdvance, userId, customerPO.getCid(), advancePaymentPO, orderId);
			paymentVO.setUniqueid("M" + materialReceiptPO.getMrId());
			advancePaymentService.updateAdvancePayment(paymentVO, materialPO.getCompany());
		}

		materialPaymentVO.setMrId(materialReceiptPO.getMrId());
		
		if(posids != null && posids.size() > 0){
			pointofsalesService.updatePointofsales(posids, materialReceiptPO.getMrId(), PointofsalesPO.STATUS_USED_INT, PointofsalesPO.TYPE_MATERIAL_INT);
		}

		decorationService.sendMessage(materialPaymentPO.getMaterial().getOrderId(), "主材单", String.format("主材交款金额%.3f元", Arith.div(materialPaymentPO.getReferMoney(), 1000.0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPayments(MaterialVO materialVO, List<MaterialPaymentVO> materialPaymentVOs, MaterialReceiptVO materialReceiptVO, List<Long> posids, String userId, Integer company) throws FLException{

		long total = 0;

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(materialVO.getOrderId());

		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}

		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();

		Long advance = materialReceiptVO.getAdvance();
		Long cash = materialReceiptVO.getCash();
		Long bank = materialReceiptVO.getBank();
		Long checkv = materialReceiptVO.getCheckv();
		Long coupon = materialReceiptVO.getCoupon();

		if(advance != null && advance != 0){
			materialReceiptPO.setAdvance(materialReceiptVO.getAdvance());
			materialReceiptPO.setAdvanceType(materialReceiptVO.getAdvanceType());
			total = Arith.add(total, materialReceiptVO.getAdvance());
		}

		if(cash != null && cash != 0){
			materialReceiptPO.setCash(materialReceiptVO.getCash());
			materialReceiptPO.setCashInfo(materialReceiptVO.getCashInfo());
			total = Arith.add(total, materialReceiptVO.getCash());
		}
		if(bank != null && bank != 0){
			materialReceiptPO.setBank(materialReceiptVO.getBank());
			materialReceiptPO.setBankInfo(materialReceiptVO.getBankInfo());
			total = Arith.add(total, materialReceiptVO.getBank());
		}
		if(checkv != null && checkv != 0){
			materialReceiptPO.setCheckv(materialReceiptVO.getCheckv());
			materialReceiptPO.setCheckvBank(materialReceiptVO.getCheckvBank());
			total = Arith.add(total, materialReceiptVO.getCheckv());
		}
		if(coupon != null && coupon != 0){
			materialReceiptPO.setCoupon(materialReceiptVO.getCoupon());
			materialReceiptPO.setCouponInfo(materialReceiptVO.getCouponInfo());
			total = Arith.add(total, materialReceiptVO.getCoupon());
		}

		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialReceiptPO.setCollecter(userPO);
			materialReceiptPO.setCollecterName(userPO.getCurrentName());
		}
		
		materialReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		materialReceiptPO.setComment(materialReceiptVO.getComment());
		materialReceiptPO.setType(MaterialReceiptPO.RECEIPT_TYPE_COLLECT_INT);

		materialReceiptDao.save(materialReceiptPO);
		
		if(advance != null && advance != 0){

			int advanceType = materialReceiptVO.getAdvanceType();
			long customerAdvance = 0;
			Short _paymentType = 0;

			CustomerPO customerPO = decorationPO.getCustomer();

			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByOrderId(materialVO.getOrderId());

			if(advancePaymentPO == null){
				throw new FLException(150010, "预付款余额不足");
			}
			
			if(advancePaymentPO.getMaterialBalance() < advance){
				throw new FLException(150010, "预付款余额不足");
			}

			if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_MATERIAL_INT){
				customerAdvance = advancePaymentPO.getMaterialBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_MATERIAL_INT;
			}else if(advanceType == MaterialPaymentPO.ADVANCETYPE_TYPE_ZATERIAL_INT){
				customerAdvance = advancePaymentPO.getZhenglinBalance();
				_paymentType = CustomerPO.BALANCE_TYPE_ZHENGLIN_INT;
			}

			PaymentVO paymentVO  = new PaymentVO();

			paymentVO = PaymentServiceImpl.advancePaymentBalance(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR,advance, _paymentType, customerAdvance, userId, customerPO.getCid(), advancePaymentPO, materialVO.getOrderId());
			paymentVO.setUniqueid("M" + materialReceiptPO.getMrId());
			advancePaymentService.updateAdvancePayment(paymentVO, decorationPO.getCompany());
		}

		long referMoney = 0;

		for(MaterialPaymentVO materialPaymentVO: materialPaymentVOs){

			MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

			if(materialPaymentPO == null){
				throw new FLException(150003, "款项不存在");
			}
			
			if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
				throw new FLException(150036, "款项状态不可操作");
			}
			
			referMoney = Arith.add(referMoney,materialPaymentPO.getReferMoney());
		}

		if(total != referMoney){
			throw new FLException(150008, "款项不能进行收款");
		}
		
		long totalMoney = 0;
		
		for(MaterialPaymentVO materialPaymentVO: materialPaymentVOs){

			MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

			if(materialPaymentPO == null){
				throw new FLException(150003, "款项不存在");
			}

			MaterialPO materialPO = materialPaymentPO.getMaterial();

			if(materialPO == null){
				throw new FLException(180001, "主材订单不存在");
			}

			if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
				throw new FLException(150021, "主材场外当前状态不能收款");
			}

			materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);

			int paymentType = materialPaymentPO.getPaymentType();

			if(materialPO != null){
				if(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT == paymentType){
					materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);					
				}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType){
					materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);
					materialPO.setFullpayTime(materialReceiptPO.getCollectTime());
				}

				materialDao.update(materialPO);

			}

			materialPaymentPO.setMaterialReceipt(materialReceiptPO);
			
			materialPaymentPO.setCompany(company);

			materialPaymentDao.update(materialPaymentPO);

			materialReceiptVO.setMrId(materialReceiptPO.getMrId());

			totalMoney = Arith.add(totalMoney, materialPaymentPO.getReferMoney());
		}
		
		if(posids != null && posids.size() > 0){
			pointofsalesService.updatePointofsales(posids, materialReceiptPO.getMrId(), PointofsalesPO.STATUS_USED_INT, PointofsalesPO.TYPE_MATERIAL_INT);
		}
		
		decorationService.sendMessage(materialVO.getOrderId(), "主材单", String.format("主材交款金额%.3f元", Arith.div(totalMoney, 1000.0)));
		
		return 0;
	}

	//主材退款收款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId, Integer company) throws FLException{

		long real = 0;
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());
	
		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();

		MaterialPO materialPO = materialPaymentPO.getMaterial();

		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}

		Long cash = materialPaymentVO.getCash();
		Long bank = materialPaymentVO.getBank();
		Long checkv = materialPaymentVO.getCheckv();
		Long coupon = materialPaymentVO.getCoupon();

		int paymentType = materialPaymentPO.getPaymentType() ;

		if(cash != null && cash != 0f){
			materialReceiptPO.setCash(materialPaymentVO.getCash());
			materialReceiptPO.setCashInfo(materialPaymentVO.getCashInfo());
			real = Arith.add(real, cash);
		}
		
		if(bank != null && bank != 0f){
			materialReceiptPO.setBank(bank);
			materialReceiptPO.setBankInfo(materialPaymentVO.getBankInfo());
			real = Arith.add(real, bank);
		}
		
		if(checkv != null && checkv != 0f){
			materialReceiptPO.setCheckv(materialPaymentVO.getCheckv());
			materialReceiptPO.setCheckvBank(materialPaymentVO.getCheckvBank());
			real = Arith.add(real, checkv);
		}
		
		if(coupon != null && coupon != 0f){
			materialReceiptPO.setCoupon(coupon);
			materialReceiptPO.setCouponInfo(materialPaymentVO.getCouponInfo());
			real = Arith.add(real, coupon);
		}
		
		if(materialPaymentPO.getReferMoney() != real){
			throw new FLException(150008, "款项不能进行收款");
		}

		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT);

		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT){
			//定金退款
			materialPO.setDepositPayment(0);
			materialPO.setDepositStatus(MaterialPO.STATUS_TYPE_INIT_INT);
			materialDao.update(materialPO);
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
			//2 已付款
			materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);
			materialPO.setFullpayTime(materialReceiptPO.getCollectTime());
			materialDao.update(materialPO);
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){
			materialRefundDao.updateMaterialRefundForStatusByMpId(materialPaymentPO.getMpId(), MaterialRefundPO.STATUS_TYPE_PAYMENTCOLLECT_INT);
		}

		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialReceiptPO.setCollecterName(userPO.getCurrentName());
		}
		materialReceiptPO.setCollecter(userPO);
		materialReceiptPO.setCollectTime(DateUtil.getDateToTimestamp(new Date()));
		materialReceiptPO.setType(MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT);
		materialReceiptPO.setComment(materialPaymentVO.getComment());
		
		materialPaymentPO.setMaterialReceipt(materialReceiptPO);
		materialPaymentPO.setCompany(company);

		materialReceiptDao.save(materialReceiptPO);
		materialPaymentDao.update(materialPaymentPO);

		materialPaymentVO.setMrId(materialReceiptPO.getMrId());

		decorationService.sendMessage(materialPaymentPO.getMaterial().getOrderId(), "主材单", String.format("主材退款金额%.3f元", Arith.div(materialPaymentPO.getReferMoney(), 1000.0)));

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialPayment(MaterialPaymentVO materialPaymentVO,MaterialReceiptVO materialReceiptVO) throws FLException{
		
		long realMoney = 0;
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();

		if(MaterialPaymentPO.PAYMENTSTATUS_PAY_STR != materialPaymentPO.getPaymentStatus()){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		long referMoney = Arith.add(Arith.add(Arith.add(Arith.add(Arith.add(Arith.add(materialReceiptPO.getCash(), materialReceiptPO.getBank()), materialReceiptPO.getCheckv()), materialReceiptPO.getCoupon()), materialReceiptPO.getAdvance()), materialReceiptPO.getInstallment()), materialReceiptPO.getAccounts());
		
		Long cash = materialReceiptVO.getCash();
		Long bank = materialReceiptVO.getBank();
		Long checkv = materialReceiptVO.getCheckv();
		Long coupon = materialReceiptVO.getCoupon();
		Long advance = materialReceiptVO.getAdvance();
		
		//判断弹窗实收累加金额
		if(cash != null && cash != 0){
			materialReceiptPO.setCash(cash);
			materialReceiptPO.setCashInfo(materialReceiptVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}else{
			materialReceiptPO.setCash(0);
			materialReceiptPO.setCashInfo("");
		}
		
		if(checkv != null && checkv != 0){
			materialReceiptPO.setCheckv(checkv);
			materialReceiptPO.setCheckvBank(materialReceiptVO.getCheckvBank());
			realMoney = Arith.add(checkv,realMoney);
		}else{
			materialReceiptPO.setCheckv(0);
			materialReceiptPO.setCheckvBank("");
		}
		
		if(bank != null && bank != 0){
			realMoney = Arith.add(bank,realMoney);
		}
		
		if(coupon != null && coupon != 0){
			realMoney = Arith.add(coupon,realMoney);
		}
		
		if(advance != null && advance != 0){
			realMoney = Arith.add(advance,realMoney);
		}
		
		if(realMoney != referMoney){
			throw new FLException(150025, "款项金额不正确");
		}
		
		materialPaymentVO.setMrId(materialReceiptPO.getMrId());

		materialReceiptDao.update(materialReceiptPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void confirmMaterialPayment(List<Long> mpIds, String userId) throws FLException{

		for(Long mpId: mpIds){
			MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(mpId);

			if(materialPaymentPO == null){
				throw new FLException(150003, "款项不存在");
			}

			MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();

			MaterialPO materialPO = materialPaymentPO.getMaterial();

			if(materialPO == null){
				throw new FLException(180001, "主材订单不存在");
			}

			if(materialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT){
				if(materialPaymentPO.getPaymentType() == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){

					List<MaterialRefundPO> materialRefundPOs = materialRefundDao.queryMaterialRefundByMpId(materialPaymentPO.getMpId());

					for(MaterialRefundPO materialRefundPO: materialRefundPOs){
						materialRefundPO.setStatus(MaterialRefundPO.STATUS_TYPE_PAYMENTCONFIRM_INT);
						materialRefundDao.update(materialRefundPO);
					}
				}else{

					int materialPaymentType = materialPaymentPO.getPaymentType();

					if(materialPO != null){
						if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){
							materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_CONFIRM_INT);
						}else if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT || materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
							materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_CONFIRM_INT);
						}

						materialDao.update(materialPO);
					}
				}

				UserPO userPO = userDao.queryUserByUserId(userId);
				materialReceiptPO.setConfirmer(userPO);
				materialReceiptPO.setConfirmerName(userPO.getUserName());
				materialReceiptPO.setConfirmTime(DateUtil.getDateToTimestamp(new Date()));
				materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT);

				if(materialReceiptPO.getStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT){
					materialReceiptPO.setStatus((short) MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT);
				}

				materialReceiptDao.update(materialReceiptPO);
				materialPaymentDao.update(materialPaymentPO);
			}
		}
	}
	
	//撤销定金主材款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int cancelMaterialPaymentForDeposit(MaterialPaymentVO materialPaymentVO) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();
		
		if(materialPaymentDao.countMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);
		
		if(materialPaymentPOs.size() == 0){
			throw new FLException(150037, "定金不存在");
		}
		
		MaterialPaymentPO materialPaymentPO = materialPaymentPOs.get(0);
		
		if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			throw new FLException(150036, "款项状态不可操作");
		}

		materialPaymentDao.delete(materialPaymentPO);
		
		MaterialPO materialPO = materialDao.get(msoId);

		int depositStatus = materialPO.getDepositStatus();

		if(materialPO != null){
			if(depositStatus == MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT){
				materialPO.setDepositPayment(0);
				materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
			}

			materialDao.update(materialPO);
		}

		materialPaymentVO.setPaymentStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
			
		return 0;

	}
	
	//撤销补款主材款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int cancelMaterialPaymentForFullpay(MaterialPaymentVO materialPaymentVO) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();
		
		List<Short> paymentTypes = Arrays.asList(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT);
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidATypes(msoId, paymentTypes);
		
		if(materialPaymentPOs.size() == 0){
			throw new FLException(150038, "补款不存在");
		}
		
		MaterialPaymentPO materialPaymentPO = materialPaymentPOs.get(0);
		
		if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		materialPaymentDao.delete(materialPaymentPO);
		
		MaterialPO materialPO = materialDao.get(msoId);
		
		int fullStatus = materialPO.getFullStatus();

		if(materialPO != null){
			if(fullStatus == MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT){
				materialPO.setFullPayment(0);
				materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
			}

			materialDao.update(materialPO);
		}

		materialPaymentVO.setPaymentStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
			
		return 0;
		
	}
	
	//生成主材款中定金退款
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void refundMaterialPaymentForDeposit(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();
		
		if(materialPaymentDao.countMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT) > 0){
			throw new FLException(150040, "补款已存在");
		}
		
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);
		
		if(materialPaymentPOs.size() == 0){
			throw new FLException(150037, "定金不存在");
		}
		
		MaterialPaymentPO depositMaterialPaymentPO = materialPaymentPOs.get(0);
		
		if(depositMaterialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT){
			throw new FLException(150012, "款项不能进行退款");
		}
		
		MaterialPO materialPO = materialDao.get(msoId);

		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();

		materialPaymentPO.setMaterial(materialPO);
		materialPaymentPO.setCategory(materialPO.getCategory());
		materialPaymentPO.setBrand(materialPO.getBrand());
		materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT);
		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);
		
		UserPO userPO = userDao.queryUserByUserId(userId);
		materialPaymentPO.setCreater(userPO);
		materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));

		materialPaymentPO.setReferMoney(depositMaterialPaymentPO.getReferMoney());
		materialPaymentPO.setCompany(materialPO.getCompany());

		materialPO.setDepositPayment(0);
		materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
		materialPO.setStatus(MaterialPO.STATUS_TYPE_WASTE_INT);

		materialPaymentDao.save(materialPaymentPO);

		materialDao.update(materialPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundMaterialPaymentForCoupon(MaterialVO materialVO, String userId) throws FLException{

		long msoId = materialVO.getMid();
		
		List<Short> paymentTypes = Arrays.asList(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT, MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT);
		
		List<MaterialPaymentPO> depositMaterialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidATypes(msoId, paymentTypes);
		
		if(depositMaterialPaymentPOs.size() == 0){
			throw new FLException(150003, "款项不存在");
		}
		
		if(depositMaterialPaymentPOs.size() == 1){
			MaterialPaymentPO depositMaterialPaymentPO = depositMaterialPaymentPOs.get(0);
			
			if(depositMaterialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
				throw new FLException(150012, "款项不能进行退款");
			}
		}

		MaterialPO materialPO = materialDao.get(materialVO.getMid());

		if(materialPO != null){

			materialPO.setCoupon(materialVO.getCoupon());
			materialPO.setCouponInfo(materialVO.getCouponInfo());
			materialDao.update(materialPO);

			List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT);

			if(materialPaymentPOs.size() > 0){
				throw new FLException(150011, "主材退券款项已经存在");
			}

			MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();

			materialPaymentPO.setMaterial(materialPO);
			materialPaymentPO.setCategory(materialPO.getCategory());
			materialPaymentPO.setBrand(materialPO.getBrand());
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT);
			
			UserPO userCreater = userDao.queryUserByUserId(userId);
			materialPaymentPO.setCreater(userCreater);
			materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			
			materialPaymentPO.setReferMoney(materialVO.getCoupon());
			materialPaymentPO.setCompany(materialPO.getCompany());

			materialPaymentDao.save(materialPaymentPO);
		}

		return 0;
	}

}
