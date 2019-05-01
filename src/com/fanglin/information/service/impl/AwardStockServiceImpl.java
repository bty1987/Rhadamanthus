package com.fanglin.information.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.information.service.AwardStockService;
import com.fanglin.information.vo.AwardStockVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Service("awardStockService")
@Transactional(readOnly = true)
public class AwardStockServiceImpl implements AwardStockService {

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Autowired
	private UserDao userdDao;

	@Override
	public void pageAwardStock(Paging paging, List<Filter> filters, int company) {

		List<AwardStockPO> awardStockPOs = awardStockDao.pageAwardStock(paging, filters, company);
		List<AwardStockVO> awardStockVOs = new ArrayList<AwardStockVO>();

		for (AwardStockPO awardStockPO : awardStockPOs) {
			
			AwardStockVO awardStockVO = new AwardStockVO();

			BeanUtil.copyProperties(awardStockPO, awardStockVO);

			awardStockVOs.add(awardStockVO);
		}

		paging.setData(awardStockVOs);
	}

	@Override
	public List<AwardStockVO> queryAwardStockByType(AwardStockVO awardStock, int company) {

		List<AwardStockPO> awardStockPOs = awardStockDao.queryAwardStock(awardStock.getType(), company);
		List<AwardStockVO> awardStockVOs = new ArrayList<AwardStockVO>();

		for (AwardStockPO awardStockPO : awardStockPOs) {

			AwardStockVO awardStockVO = new AwardStockVO();

			BeanUtil.copyProperties(awardStockPO, awardStockVO);

			awardStockVOs.add(awardStockVO);
		}

		return awardStockVOs;
	}

	@Override
	public AwardStockVO queryAwardStockByAsid(AwardStockVO awardStockVO) throws FLException {

		if (awardStockVO.getAsId() == 0) {// 0:asId不存在
			throw new FLException(160043, "物品不存在");
		}

		AwardStockPO awardStockPO = awardStockDao.get(awardStockVO.getAsId());

		AwardStockVO awardStock = new AwardStockVO();

		BeanUtil.copyProperties(awardStockPO, awardStock);

		return awardStock;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addAwardStock(AwardStockVO awardStockVO, String userId, int company) throws FLException {
		
		AwardStockPO awardStockPO = new AwardStockPO();

		BeanUtil.copyProperties(awardStockVO, awardStockPO);
		
		awardStockPO.setStatus(AwardStockPO.STATUS_ABLE_SHORT);
		awardStockPO.setCompany(company);

		awardStockDao.save(awardStockPO);
		
		if (awardStockVO.getIsStock() == AwardStockPO.ISSTOCK_CAL_INT) {// 0:计算
			saveAwardRecord(awardStockPO, awardStockVO, userId, AwardStockPO.TYPE_CG_INT);//po.入库-0
		}
		
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAwardStock(AwardStockVO awardStockVO) throws FLException {

		AwardStockPO awardStockPO = awardStockDao.get(awardStockVO.getAsId());

		if (awardStockPO == null) {
			throw new FLException(160043, "物品不存在");
		}
		
		awardStockPO.setIsPrefor(awardStockVO.getIsPrefor());
		awardStockPO.setIsStock(awardStockVO.getIsStock());
		awardStockPO.setContent(awardStockVO.getContent());
		awardStockPO.setFormat(awardStockVO.getFormat());
		awardStockPO.setStoreroom(awardStockVO.getStoreroom());
		awardStockPO.setIsPayment(awardStockVO.getIsPayment());
		
		awardStockDao.update(awardStockPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAwardStockForXG(AwardStockVO awardStockVO, String userId) throws FLException { // 出库

		AwardStockPO awardStockPO = awardStockDao.get(awardStockVO.getAsId());

		if (awardStockPO == null) {
			throw new FLException(160043, "物品不存在");
		}

		if (awardStockPO.getIsStock() != AwardStockPO.ISSTOCK_CAL_INT) {// 0:不计算
			throw new FLException(160040, "物品不能出库");
		}

		if (awardStockVO.getNum() > awardStockPO.getNum()) {
			throw new FLException(160038, "库存不足");
		}
		
		awardStockPO.setNum(Arith.sub(awardStockPO.getNum(), awardStockVO.getNum()));

		saveAwardRecord(awardStockPO, awardStockVO, userId, AwardStockPO.TYPE_XG_INT);
		
		awardStockDao.update(awardStockPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAwardStockForCG(AwardStockVO awardStockVO, String userId) throws FLException { // 入库

		AwardStockPO awardStockPO = awardStockDao.get(awardStockVO.getAsId());
		if (awardStockPO == null) {
			throw new FLException(160043, "物品不存在");
		}

		if (awardStockPO.getIsStock() != AwardStockPO.ISSTOCK_CAL_INT) {// 0:不计算
			throw new FLException(160041, "物品不能入库");
		}

		awardStockPO.setNum(Arith.add(awardStockPO.getNum(), awardStockVO.getNum()));
		
		saveAwardRecord(awardStockPO, awardStockVO, userId, AwardStockPO.TYPE_CG_INT);
		
		awardStockDao.update(awardStockPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void checkAwardStock(AwardStockVO awardStockVO, String userId) throws FLException {

		AwardStockPO awardStockPO = awardStockDao.get(awardStockVO.getAsId());

		if (awardStockPO == null) {   
			throw new FLException(160043, "物品不存在");
		}

		if (awardStockPO.getIsStock() != AwardStockPO.ISSTOCK_CAL_INT) {// 0:不计算
			throw new FLException(160042, "该种类型的物品不能盘点");
		}
		
		short type = awardStockPO.getNum() > awardStockVO.getNum() ? AwardStockPO.TYPE_LOSSES_INT : AwardStockPO.TYPE_SURPLUS_INT;
		
		float num = awardStockVO.getNum();
		
		awardStockVO.setNum(Math.abs(Arith.sub(awardStockPO.getNum(), awardStockVO.getNum())));
		awardStockPO.setNum(num);
		
		saveAwardRecord(awardStockPO, awardStockVO, userId, type);

		awardStockDao.update(awardStockPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateAwardStockForStatus(AwardStockVO awardStockVO) throws FLException {

		AwardStockPO awardStockPO = awardStockDao.get(awardStockVO.getAsId());
		if (awardStockPO == null) {
			throw new FLException(160043, "物品不存在");
		}

		awardStockPO.setStatus(awardStockVO.getStatus());

		awardStockDao.update(awardStockPO);

	}

	public void saveAwardRecord(AwardStockPO awardStockPO, AwardStockVO awardStockVO, String userId, short type) {
		
		UserPO user = userdDao.queryUserByUserId(userId);
		
		float price = awardStockVO.getPrice() == null ? 0 : awardStockVO.getPrice();
		
		AwardRecordPO awardRecordPO = new AwardRecordPO();

		awardRecordPO.setAwardStock(awardStockPO);
		awardRecordPO.setType(type);
		awardRecordPO.setUnitPrice(price);
		awardRecordPO.setTotalPrice(Arith.mul(price, awardStockVO.getNum()));
		awardRecordPO.setNum(awardStockVO.getNum());
		awardRecordPO.setCreater(user);
		awardRecordPO.setContent(awardStockVO.getContent());
		awardRecordPO.setOperateTime(DateUtil.getDateToTimestamp(new Date()));
		awardRecordPO.setOnetype(AwardRecordPO.ONETYPE_NOT_INT);
	
		awardRecordDao.save(awardRecordPO);
	}
	
}
