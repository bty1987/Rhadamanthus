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
import com.fanglin.decoration.vo.DecorationActivityItemVO;
import com.fanglin.information.service.MemberCardService;
import com.fanglin.material.dao.MaterialDao;
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
import com.fanglin.payment.service.AdvancePaymentService;
import com.fanglin.payment.service.MaterialPaymentService;
import com.fanglin.payment.vo.MaterialPaymentVO;
import com.fanglin.payment.vo.MaterialReceiptVO;
import com.fanglin.payment.vo.PaymentVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

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
	private MemberCardService memberCardService;

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

	@Override
	public void pageMaterialPaymentForInit(Paging paging, List<Filter> filters, int company) {

		if(filters.size() == 0) return;
		
		if (SystemConfig.getInt("multicompany", 0) != 0) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT, "eq");

		MaterialPaymentVO materialPaymentVO;

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			materialPaymentVO = new MaterialPaymentVO(new MaterialVO(new HouseVO(new VillageVO()),new CustomerVO()),new UserBaseVO());

			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO,Arrays.asList("material","creater"));
			BeanUtil.copyProperties(materialPaymentPO.getCreater(), materialPaymentVO.getCreater(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), materialPaymentVO.getMaterial(),Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getCustomer(), materialPaymentVO.getMaterial().getCustomer());
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse(), materialPaymentVO.getMaterial().getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage(), materialPaymentVO.getMaterial().getHouse().getVillage(),Arrays.asList("cityProper"));

			materialPaymentVOs.add(materialPaymentVO);
		}

		paging.setData(materialPaymentVOs);
	}
	
	@Override
	public void pageMaterialPaymentForNotInit(Paging paging, List<Filter> filters, int company){

		if(filters.size() == 0) return ;
		
		if (SystemConfig.getInt("multicompany", 0) != 0) {
			filters.add(new Filter("company", String.valueOf(company), "eq"));
		}

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT, "ne");

		MaterialPaymentVO materialPaymentVO;

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			materialPaymentVO = new MaterialPaymentVO(new MaterialVO(new HouseVO(new VillageVO()),new CustomerVO()),new UserBaseVO());

			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));
			}
			BeanUtil.copyProperties(materialPaymentPO.getCreater(), materialPaymentVO.getCreater(),Arrays.asList("duty","dept"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), materialPaymentVO.getMaterial(),Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse(), materialPaymentVO.getMaterial().getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage(), materialPaymentVO.getMaterial().getHouse().getVillage(),Arrays.asList("cityProper"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getCustomer(), materialPaymentVO.getMaterial().getCustomer());
			MaterialReceiptPO materialReceipt = materialPaymentPO.getMaterialReceipt();
			if(materialReceipt != null){
				materialPaymentVO.setCollecter(new UserBaseVO());
				BeanUtil.copyProperties(materialReceipt.getCollecter(), materialPaymentVO.getCollecter(), Arrays.asList("duty","dept"));
			}
			
			materialPaymentVOs.add(materialPaymentVO);
		}

		paging.setData(materialPaymentVOs);
	}

	@Override
	public void pageMaterialPaymentForCollect(Paging paging, List<Filter> filters, int company){

		if(filters.size() == 0) return;

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_COLLECT_INT, "eq");

		MaterialPaymentVO materialPaymentVO;

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			materialPaymentVO = new MaterialPaymentVO(new MaterialVO(new HouseVO(new VillageVO()),new CustomerVO()),new UserBaseVO());

			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));
			
			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));
			}
			
			BeanUtil.copyProperties(materialPaymentPO.getCreater(), materialPaymentVO.getCreater(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), materialPaymentVO.getMaterial(),Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getCustomer(), materialPaymentVO.getMaterial().getCustomer());
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse(), materialPaymentVO.getMaterial().getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage(), materialPaymentVO.getMaterial().getHouse().getVillage(),Arrays.asList("cityProper"));
			
			MaterialReceiptPO materialReceipt = materialPaymentPO.getMaterialReceipt();
			
			if(materialReceipt != null){
				materialPaymentVO.setCollecter(new UserBaseVO());
				BeanUtil.copyProperties(materialReceipt.getCollecter(), materialPaymentVO.getCollecter(),Arrays.asList("dept","duty"));
			}
			
			materialPaymentVOs.add(materialPaymentVO);
		}

		paging.setData(materialPaymentVOs);
	}

	@Override
	public void pageMaterialPaymentForConfirm(Paging paging, List<Filter> filters, int company){

		if(filters.size() == 0) return;

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		
		filters.add(new Filter("company", String.valueOf(company), "eq"));

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.pageMaterialPaymentForStatus(paging, filters, MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT, "eq");

		MaterialPaymentVO materialPaymentVO;

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			materialPaymentVO = new MaterialPaymentVO(new MaterialVO(new HouseVO(new VillageVO()),new CustomerVO()),new UserBaseVO());

			BeanUtil.copyProperties(materialPaymentPO, materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), materialPaymentVO,Arrays.asList("material","creater","collecter","confirmer"));
			}
			
			BeanUtil.copyProperties(materialPaymentPO.getCreater(), materialPaymentVO.getCreater(),Arrays.asList("dept","duty"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), materialPaymentVO.getMaterial(),Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getCustomer(), materialPaymentVO.getMaterial().getCustomer());
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse(), materialPaymentVO.getMaterial().getHouse(),Arrays.asList("village"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial().getHouse().getVillage(), materialPaymentVO.getMaterial().getHouse().getVillage(),Arrays.asList("cityProper"));
			
			MaterialReceiptPO materialReceipt = materialPaymentPO.getMaterialReceipt();
			
			if(materialReceipt != null){
				materialPaymentVO.setCollecter(new UserBaseVO());
				materialPaymentVO.setConfirmer(new UserBaseVO());
				BeanUtil.copyProperties(materialReceipt.getCollecter(), materialPaymentVO.getCollecter(),Arrays.asList("dept","duty"));
				BeanUtil.copyProperties(materialReceipt.getConfirmer(), materialPaymentVO.getConfirmer(),Arrays.asList("dept","duty"));
			}
			
			materialPaymentVOs.add(materialPaymentVO);
		}

		paging.setData(materialPaymentVOs);
	}

	@Override
	public List<MaterialPaymentVO> queryMaterialPaymentByOrderId(MaterialPaymentVO materialPaymentVO) {

		String orderId = materialPaymentVO.getMaterial().getOrderId();

		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();
		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByOrderId(orderId);

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){
			MaterialPaymentVO _materialPaymentVO = new MaterialPaymentVO(new MaterialVO());

			BeanUtil.copyProperties(materialPaymentPO, _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			BeanUtil.copyProperties(materialPaymentPO.getMaterial(), _materialPaymentVO.getMaterial(), Arrays.asList("house","customer","salesman","materialer","instorer","region","department","materialDepartment"));

			if(materialPaymentPO.getMaterialReceipt() != null){
				BeanUtil.copyProperties(materialPaymentPO.getMaterialReceipt(), _materialPaymentVO, Arrays.asList("material","creater","collecter","confirmer"));
			}

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
	public List<MaterialPaymentVO> queryMaterialPaymentForNotInitByMrId(MaterialReceiptVO materialReceiptVO, String userId) {

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentForNotInitByMrId(materialReceiptVO.getMrId());
		List<MaterialPaymentVO> materialPaymentVOs = new ArrayList<MaterialPaymentVO>();

		for(MaterialPaymentPO materialPaymentPO: materialPaymentPOs){

			MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();

			if(!userId.equals(materialReceiptPO.getCollecter().getUserId())){
				continue;
			}

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

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void addMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();

		MaterialPO materialPO = materialDao.get(msoId);

		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}

		if(materialPaymentVO.getReferMoney() < 0){
			throw new FLException(150025, "款项金额不正确");
		}

		if(materialPaymentDao.countMaterialPaymentByMidAType(msoId,materialPaymentVO.getPaymentType()) > 0){
			throw new FLException(150033, "款项类型已存在");
		}

		if(materialPO.getTotal() == 0 && materialPaymentVO.getPaymentType() == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			throw new FLException(180021, "主材单总金额为0");
		}

		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();
		BeanUtil.copyProperties(materialPaymentVO, materialPaymentPO, Arrays.asList("materialReceipt","material","creater"));

		materialPaymentPO.setMaterial(materialPO);
		materialPaymentPO.setCategory(materialPaymentVO.getCategory());
		materialPaymentPO.setBrand(materialPaymentVO.getBrand());
		materialPaymentPO.setCompany(materialPO.getCompany());

		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialPaymentPO.setMaterial(materialPO);
			materialPaymentPO.setCreater(userPO);
			materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		}

		int materialPaymentType = materialPaymentPO.getPaymentType();

		if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){

			if(materialPaymentDao.countMaterialPaymentByMidAType(materialPaymentVO.getMaterial().getMid(),MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT)>0){
				throw new FLException(150036, "补款已提交");
			}
			materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT);
			materialPO.setDepositPayment(materialPaymentPO.getReferMoney());

		}else if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){

			List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidAType(msoId, MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT);

			if(materialPaymentPOs.size() == 1){
				MaterialPaymentPO depositPayment = materialPaymentPOs.get(0);

				if(depositPayment.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
					throw new FLException(150029, "款项不可提交");
				}
			}
			materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT);
			materialPO.setFullPayment(materialPaymentPO.getReferMoney());

		}else if(materialPaymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){

			materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT);
			materialPO.setFullPayment(-materialPaymentPO.getReferMoney());

		}
		
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

			if(materialReceiptPO.getConfirmTime() != null && materialReceiptPO.getConfirmTime().before(dateTime)){
				oldConfirmTime = materialReceiptPO.getConfirmTime();

				materialReceiptPO.setConfirmTime(dateTime);
			}

			materialPaymentDao.update(materialPaymentPO);

			ServiceRecordPO serviceRecordPO = new ServiceRecordPO();
			serviceRecordPO.setType(ServiceRecordPO.TYPE_TYPE_CHANGE_MATERIALPAYMENT_TIME_INT);
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
	public int collectMaterialPayment(MaterialPaymentVO materialPaymentVO, List<DecorationActivityItemVO> decorationActivityItemVOs, String userId, Integer company) throws FLException{

		float realMoney = 0;

		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}
		
		if(materialPaymentPO.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
			throw new FLException(150008, "款项不能进行收款");
		}

		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();

		int paymentType = materialPaymentPO.getPaymentType();
		
		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			materialReceiptPO.setType(MaterialReceiptPO.RECEIPT_TYPE_COLLECT_INT);
		}else{
			materialReceiptPO.setType(MaterialReceiptPO.RECEIPT_TYPE_REFUND_INT);
		}

		Float advance = materialPaymentVO.getAdvance();

		if(materialPaymentVO.getAdvance() != 0){
			materialReceiptPO.setAdvance(materialPaymentVO.getAdvance());
			materialReceiptPO.setAdvanceType(materialPaymentVO.getAdvanceType());
			realMoney = Arith.add(materialPaymentVO.getAdvance(), realMoney);
		}

		if(materialPaymentVO.getCoupon() != 0){
			materialReceiptPO.setCoupon(materialPaymentVO.getCoupon());
			materialReceiptPO.setCouponInfo(materialPaymentVO.getCouponInfo());
			realMoney = Arith.add(materialPaymentVO.getCoupon(), realMoney);
		}

		if(materialPaymentVO.getCash() != 0){
			materialReceiptPO.setCash(materialPaymentVO.getCash());
			materialReceiptPO.setCashInfo(materialPaymentVO.getCashInfo());
			realMoney = Arith.add(materialPaymentVO.getCash(), realMoney);
		}
		if(materialPaymentVO.getBank() != 0){
			materialReceiptPO.setBank(materialPaymentVO.getBank());
			materialReceiptPO.setBankInfo(materialPaymentVO.getBankInfo());
			realMoney = Arith.add(materialPaymentVO.getBank(), realMoney);
		}
		if(materialPaymentVO.getCheckv() != 0){
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

		float count = 0;
		
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
		
		if(materialPaymentVO.getAdvance() != 0){

			int advanceType = materialPaymentVO.getAdvanceType();
			float customerAdvance = 0f;
			Short _paymentType = 0;

			CustomerPO customerPO = customerDao.get(materialPaymentPO.getMaterial().getCustomer().getCid());

			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCid(),materialPaymentPO.getMaterial().getCompany());

			if(advancePaymentPO == null){
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

			paymentVO = PaymentServiceImpl.advancePaymentBalance(PaymentPO.PAYMENT_DECORETION_PAYMENTNAME_STR,advance, _paymentType, customerAdvance, userId, customerPO.getCid(), advancePaymentPO, orderId);
			paymentVO.setUniqueid("M" + materialReceiptPO.getMrId());
			advancePaymentService.updateAdvancePayment(paymentVO, materialPO.getCompany());
		}

		materialPaymentVO.setMrId(materialReceiptPO.getMrId());

		memberCardService.IncreaseMemberCardIntegraldivider(materialPO, materialPaymentPO, userPO);
		
		decorationService.sendMessage(materialPaymentPO.getMaterial().getOrderId(), "主材单", String.format("主材交款金额%s元", materialPaymentPO.getReferMoney()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPayments(MaterialVO materialVO, List<MaterialPaymentVO> materialPaymentVOs, MaterialReceiptVO materialReceiptVO, String userId, Integer company) throws FLException{

		float total = 0;

		DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(materialVO.getOrderId());

		if(decorationPO == null){
			throw new FLException(140013, "订单不存在");
		}

		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();

		Float advance = materialReceiptVO.getAdvance();
		Float cash = materialReceiptVO.getCash();
		Float bank = materialReceiptVO.getBank();
		Float checkv = materialReceiptVO.getCheckv();
		Float coupon = materialReceiptVO.getCoupon();

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
			float customerAdvance = 0f;
			Short _paymentType = 0;

			CustomerPO customerPO = decorationPO.getCustomer();

			if(customerPO == null){
				throw new FLException(230001, "客户信息不存在");
			}

			AdvancePaymentPO advancePaymentPO = advancePaymentDao.queryAdvancePaymentByCustomerId(customerPO.getCid(),decorationPO.getCompany());

			if(advancePaymentPO == null){
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

		float referMoney = 0;

		for(MaterialPaymentVO materialPaymentVO: materialPaymentVOs){

			MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

			if(materialPaymentPO == null){
				throw new FLException(150003, "款项不存在");
			}
			
			referMoney = Arith.add(referMoney,materialPaymentPO.getReferMoney());
		}

		if(total != referMoney){
			throw new FLException(150008, "款项不能进行收款");
		}
		
		float totalMoney =  0f;
		
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

			float count = 0;

			if(materialPO != null){
				if(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT == paymentType){
					materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);					
					count = materialPaymentPO.getReferMoney();//这个count什么作用
				}else if(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT == paymentType){
					materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);
					materialPO.setFullpayTime(materialReceiptPO.getCollectTime());
					count = Arith.add(Arith.add(count, materialPaymentPO.getReferMoney()), materialPO.getCoupon());
				}

				materialDao.update(materialPO);

			}

			materialPaymentPO.setMaterialReceipt(materialReceiptPO);
			
			materialPaymentPO.setCompany(company);

			materialPaymentDao.update(materialPaymentPO);

			materialReceiptVO.setMrId(materialReceiptPO.getMrId());

			memberCardService.IncreaseMemberCardIntegraldivider(materialPO, materialPaymentPO, userPO);
			
			totalMoney = totalMoney + materialPaymentPO.getReferMoney();
		}
		
		decorationService.sendMessage(materialVO.getOrderId(), "主材单", String.format("主材交款金额%s元", totalMoney));
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int collectMaterialPaymentForRefund(MaterialPaymentVO materialPaymentVO, String userId, Integer company) throws FLException{

		float real = 0;
		float count = 0;

		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		MaterialReceiptPO materialReceiptPO = new MaterialReceiptPO();

		MaterialPO materialPO = materialPaymentPO.getMaterial();

		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}

		Float cash = materialPaymentVO.getCash();
		Float bank = materialPaymentVO.getBank();
		Float checkv = materialPaymentVO.getCheckv();
		Float coupon = materialPaymentVO.getCoupon();

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

		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT){

			if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
				materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_COLLECT_INT);
				materialPO.setFullpayTime(materialReceiptPO.getCollectTime());
				
				materialDao.update(materialPO);
			}

			count = Arith.add(Arith.sub(count, materialPaymentPO.getReferMoney()), materialPO.getCoupon());
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_REJECT_INT){
			List<MaterialRefundPO> materialRefundPOs = materialRefundDao.queryMaterialRefundByMpId(materialPaymentPO.getMpId());

			for(MaterialRefundPO materialRefundPO: materialRefundPOs){
				materialRefundPO.setStatus(MaterialRefundPO.STATUS_TYPE_PAYMENTCOLLECT_INT);

				materialRefundDao.update(materialRefundPO);
			}

			count = Arith.sub(count, materialPaymentPO.getReferMoney());
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

		memberCardService.MinusMemberCardIntegraldivider(materialPO, materialPaymentPO, userPO);
		
		decorationService.sendMessage(materialPaymentPO.getMaterial().getOrderId(), "主材单", String.format("主材退款金额%s元", materialPaymentPO.getReferMoney()));

		return 0;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int updateMaterialPayment(MaterialPaymentVO materialPaymentVO,MaterialReceiptVO materialReceiptVO) throws FLException{
		
		float realMoney = 0;
		
		MaterialPaymentPO materialPaymentPO = materialPaymentDao.get(materialPaymentVO.getMpId());

		if(materialPaymentPO == null){
			throw new FLException(150003, "款项不存在");
		}

		MaterialReceiptPO materialReceiptPO = materialPaymentPO.getMaterialReceipt();

		if(MaterialPaymentPO.PAYMENTSTATUS_PAY_STR != materialPaymentPO.getPaymentStatus()){
			throw new FLException(150036, "款项状态不可操作");
		}
		
		float referMoney = materialReceiptPO.getCash() + materialReceiptPO.getBank() + materialReceiptPO.getCheckv() + materialReceiptPO.getCoupon() + materialReceiptPO.getAdvance() + materialReceiptPO.getInstallment()  + materialReceiptPO.getAccounts();
		
		Float cash = materialReceiptVO.getCash();
		Float bank = materialReceiptVO.getBank();
		Float checkv = materialReceiptVO.getCheckv();
		Float coupon = materialReceiptVO.getCoupon();
		Float advance = materialReceiptVO.getAdvance();
		
		//判断弹窗实收累加金额
		if(cash != null && cash.floatValue() != 0f){
			materialReceiptPO.setCash(cash);
			materialReceiptPO.setCashInfo(materialReceiptVO.getCashInfo());
			realMoney = Arith.add(cash, realMoney);
		}else{
			materialReceiptPO.setCash(0f);
			materialReceiptPO.setCashInfo("");
		}
		
		if(bank != null && bank.floatValue() != 0f){
			materialReceiptPO.setBank(bank);
			materialReceiptPO.setBankInfo(materialReceiptVO.getBankInfo());
			realMoney = Arith.add(bank,realMoney);
		}else{
			materialReceiptPO.setBank(0f);
			materialReceiptPO.setBankInfo("");
		}
		
		if(checkv != null && checkv.floatValue() != 0f){
			materialReceiptPO.setCheckv(checkv);
			materialReceiptPO.setCheckvBank(materialReceiptVO.getCheckvBank());
			realMoney = Arith.add(checkv,realMoney);
		}else{
			materialReceiptPO.setCheckv(0f);
			materialReceiptPO.setCheckvBank("");
		}
		
		if(coupon != null && coupon.floatValue() != 0f){
			realMoney = Arith.add(coupon,realMoney);
		}
		
		if(advance != null && advance.floatValue() != 0f){
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


	@Override
	@Transactional(rollbackFor=Exception.class)
	public int cancelMaterialPayment(MaterialPaymentVO materialPaymentVO) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();
		short paymentType = materialPaymentVO.getPaymentType();

		List<MaterialPaymentPO> materialPaymentPOs = materialPaymentDao.queryMaterialPaymentByMidATypeAStatus(msoId, paymentType, MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);

		int materialPaymentLength = materialPaymentPOs.size();

		if(materialPaymentLength == 1){
			MaterialPaymentPO materialPaymentPO = materialPaymentPOs.get(0);

			MaterialPO materialPO = materialDao.get(materialPaymentVO.getMaterial().getMid());

			if(materialPaymentPO != null){
				if(materialPaymentPO.getPaymentStatus() == MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT){
					materialPaymentDao.delete(materialPaymentPO);

					int depositStatus = materialPO.getDepositStatus();
					int fullStatus = materialPO.getFullStatus();

					if(materialPO != null){
						if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT && depositStatus == MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT){
							materialPO.setDepositPayment(0);
							materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
						}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT || paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT){
							if(fullStatus == MaterialPO.FINANCE_STATUS_TYPE_COMMIT_INT){
								materialPO.setFullPayment(0);
								materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
							}
						}

						materialDao.update(materialPO);
					}

					materialPaymentVO.setPaymentStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);

					return 0;
				}
			}
		}

		throw new FLException(150019, "款项不能撤销");
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void refundMaterialPayment(MaterialPaymentVO materialPaymentVO, String userId) throws FLException{

		long msoId = materialPaymentVO.getMaterial().getMid();
		short paymentType = materialPaymentVO.getPaymentType();

		MaterialPO materialPO = materialDao.get(msoId);

		if(materialPO == null){
			throw new FLException(180001, "主材订单不存在");
		}

		MaterialPaymentPO materialPaymentPO = new MaterialPaymentPO();

		materialPaymentPO.setMaterial(materialPO);

		if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_INT){

			MaterialPaymentPO materialPayment = materialPaymentDao.queryMaterialPaymentByMsoNoAType(materialPO.getNo(), paymentType);

			if( materialPayment.getPaymentStatus() != MaterialPaymentPO.PAYMENTSTATUS_TYPE_CONFIRM_INT){
				throw new FLException(150005 , "款项状态非已确认,不能退款");
			}

			materialPaymentPO.setReferMoney(materialPO.getDepositPayment());

			materialPO.setDepositStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
			materialPO.setDepositPayment(0);
			materialPO.setStatus(MaterialPO.STATUS_TYPE_WASTE_INT);

			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_DEPOSIT_REFUND_INT);
		}else if(paymentType == MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_INT){
			materialPaymentPO.setReferMoney(materialPO.getFullPayment());

			materialPO.setFullStatus(MaterialPO.FINANCE_STATUS_TYPE_INIT_INT);
			materialPO.setFullPayment(0);

			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_FULL_REFUND_INT);
		}

		materialPaymentPO.setPaymentStatus(MaterialPaymentPO.PAYMENTSTATUS_TYPE_INIT_INT);

		UserPO userPO = userDao.queryUserByUserId(userId);
		if(userPO != null){
			materialPaymentPO.setCreater(userPO);
			materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
		}
		
		materialPaymentPO.setCategory(materialPO.getCategory());
		materialPaymentPO.setBrand(materialPO.getBrand());
		materialPaymentPO.setCompany(materialPO.getCompany());

		materialPaymentDao.save(materialPaymentPO);

		materialDao.update(materialPO);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public int refundMaterialPaymentForCoupon(MaterialVO materialVO, String userId) throws FLException{

		long msoId = materialVO.getMid();

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
			materialPaymentPO.setReferMoney(materialVO.getCoupon());
			materialPaymentPO.setPaymentType(MaterialPaymentPO.PAYMENTTYPE_TYPE_COUPON_REFUND_INT);
			
			materialPaymentPO.setCategory(materialPO.getCategory());
			materialPaymentPO.setBrand(materialPO.getBrand());
			
			UserPO userCreater = userDao.queryUserByUserId(userId);
			materialPaymentPO.setCreater(userCreater);
			materialPaymentPO.setCreateTime(DateUtil.getDateToTimestamp(new Date()));
			materialPaymentPO.setCompany(materialPO.getCompany());

			materialPaymentDao.save(materialPaymentPO);
		}

		return 0;
	}

}
