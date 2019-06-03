package com.fanglin.material.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSONObject;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.dao.DecorationDao;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.information.dao.AwardRecordDao;
import com.fanglin.information.dao.AwardStockDao;
import com.fanglin.information.po.AwardRecordPO;
import com.fanglin.information.po.AwardStockPO;
import com.fanglin.material.dao.MaterialActivityDao;
import com.fanglin.material.dao.MaterialDao;
import com.fanglin.material.po.MaterialActivityItemPO;
import com.fanglin.material.po.MaterialPO;
import com.fanglin.material.service.MaterialActivityService;
import com.fanglin.material.vo.MaterialActivityItemVO;
import com.fanglin.material.vo.MaterialVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.DateUtil;

@Service("materialActivityService")
@Transactional(readOnly = true)
public class MaterialActivityServiceImpl implements MaterialActivityService {

	@Autowired
	private MaterialActivityDao materialActivityDao;

	@Autowired
	private MaterialDao materialDao;

	@Autowired
	private AwardStockDao awardStockDao;

	@Autowired
	private AwardRecordDao awardRecordDao;

	@Autowired
	private UserDao userDao;
	
	@Autowired
	private DecorationDao decorationDao;

	@Override
	public List<MaterialActivityItemVO> queryMaterialActivityItem(String orderId) {

		List<MaterialActivityItemPO> mterialActivityItemPOs = materialActivityDao.queryMaterialActivityItem(orderId);
		List<MaterialActivityItemVO> mterialActivityItemVOs = new ArrayList<MaterialActivityItemVO>();

		for (MaterialActivityItemPO materialActivityItemPO : mterialActivityItemPOs) {

			MaterialActivityItemVO materialActivityItemVO = new MaterialActivityItemVO();

			BeanUtil.copyProperties(materialActivityItemPO, materialActivityItemVO, Arrays.asList("receiveUserId"));

			if (materialActivityItemPO.getAsid() != 0) {
				BeanUtil.copyProperties(materialActivityItemPO.getAsid(), materialActivityItemVO.getAsid());
			}

			materialActivityItemVO.setReceiveUserId(new UserBaseVO());
			BeanUtil.copyProperties(materialActivityItemPO.getReceiveUserId(), materialActivityItemVO.getReceiveUserId(), Arrays.asList("dept", "duty"));

			mterialActivityItemVOs.add(materialActivityItemVO);
		}
		return mterialActivityItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMaterialActivityItem(List<MaterialActivityItemVO> materialActivityItems) throws FLException {

		for (MaterialActivityItemVO materialActivityItemVO : materialActivityItems) {
			
			DecorationPO decorationPO = decorationDao.queryDecorationByOrderId(materialActivityItemVO.getOrderId());
			
			if (decorationPO == null) {
				throw new FLException(140013, "订单不存在");
			}

			MaterialActivityItemPO materialActivityItemPO = new MaterialActivityItemPO();

			BeanUtil.copyPropertie(materialActivityItemVO, materialActivityItemPO);

			materialActivityItemPO.setReceiveUserName("");
			materialActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

			materialActivityDao.save(materialActivityItemPO);
		}

		return 0;
	}

	@Override
	public Object queryMaterialActivity(String orderId) {

		List<Object> queryMaterialActivityByTotal = materialDao.queryMaterialActivityByTotal(orderId);

		Object materialObject = JSONObject.toJSON(queryMaterialActivityByTotal);

		return materialObject;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMaterialForActivity(MaterialVO materialVO) throws FLException {

		MaterialPO materialPO = materialDao.get(materialVO.getMid());

		if (materialPO == null) {
			throw new FLException(180001, "主材订单不存在");
		}

		materialPO.setActivityId(materialVO.getActivityId());

		materialDao.update(materialPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int abateMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException {

		MaterialActivityItemPO materialActivityItemPO = materialActivityDao.get(materialActivityItemVO.getMaiid());

		if (materialActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if(materialActivityItemPO.getState() != MaterialActivityItemPO.STATUS_INIT_INT){
			throw new FLException(140057, "订单活动奖品不可操作");
		}

		materialActivityItemPO.setState(MaterialActivityItemPO.STATUS_UNVALID_INT);
		materialActivityItemPO.setIsStock(MaterialActivityItemPO.STOCK_NC_INT);

		materialActivityDao.update(materialActivityItemPO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int receiveMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO, String userId, String userName) throws FLException {

		MaterialActivityItemPO materialActivityItemPO = materialActivityDao.get(materialActivityItemVO.getMaiid());

		if (materialActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}

		if(materialActivityItemPO.getState() != MaterialActivityItemPO.STATUS_INIT_INT){
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		
		materialActivityItemPO.setState(MaterialActivityItemPO.STATUS_RECEIVE_INT);
		materialActivityItemPO.setIsStock(MaterialActivityItemPO.STOCK_NUMBER_INT);
		materialActivityItemPO.setReceiveUserId(userDao.queryUserByUserId(userId));
		materialActivityItemPO.setReceiveUserName(userName);
		materialActivityItemPO.setReceiveTime(DateUtil.getDateToTimestamp(new Date()));

		materialActivityDao.update(materialActivityItemPO);

		AwardStockPO awardStockPO = awardStockDao.get(materialActivityItemPO.getAsid());
		UserPO creater = userDao.queryUserByUserId(userId);
		
		if (materialActivityItemPO.getIsStock() == 0) {

			float num = Arith.sub(awardStockPO.getNum(), materialActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足!");
			}

			awardStockPO.setNum(Arith.sub(awardStockPO.getNum(), materialActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);
		}
		
		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, creater, AwardRecordPO.TYPE_XG_INT, AwardRecordPO.SUBTYPE_RECEIVE_INT, AwardRecordPO.ONETYPE_MATERIAL_INT, materialActivityItemPO.getIsStock(), materialActivityItemPO.getMoney(), materialActivityItemPO.getNum(), "领取活动奖品");
		awardRecordDao.save(awardRecordPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int deliveMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException {
		
		MaterialActivityItemPO materialActivityItemPO = materialActivityDao.get(materialActivityItemVO.getMaiid());

		if (materialActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if(materialActivityItemPO.getState() != MaterialActivityItemPO.STATUS_INIT_INT){
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		
		materialActivityItemPO.setState(MaterialActivityItemPO.STATUS_DELIVERY_INT);
		materialActivityItemPO.setIsStock(MaterialActivityItemPO.STOCK_NC_INT);

		materialActivityDao.update(materialActivityItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int unrefundMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException {

		MaterialActivityItemPO materialActivityItemPO = materialActivityDao.get(materialActivityItemVO.getMaiid());

		if (materialActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if(materialActivityItemPO.getState() != MaterialActivityItemPO.STATUS_RECEIVE_INT){
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		
		materialActivityItemPO.setState(MaterialActivityItemPO.STATUS_WAIT_INT);
		materialActivityItemPO.setIsStock(MaterialActivityItemPO.STOCK_NC_INT);

		materialActivityDao.update(materialActivityItemPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int refundMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO, String userId,String userName) throws FLException {

		MaterialActivityItemPO materialActivityItemPO = materialActivityDao.get(materialActivityItemVO.getMaiid());
		List<Short> status = Arrays.asList(new Short[] {MaterialActivityItemPO.STATUS_RECEIVE_INT, MaterialActivityItemPO.STATUS_WAIT_INT});
		
		if (materialActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if(!status.contains(materialActivityItemPO.getState())){
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		
		materialActivityItemPO.setState(MaterialActivityItemPO.STATUS_RETREAT_INT);
		materialActivityItemPO.setIsStock(MaterialActivityItemPO.STOCK_NUMBER_INT);

		materialActivityDao.update(materialActivityItemPO);
		
		AwardStockPO awardStockPO = awardStockDao.get(materialActivityItemPO.getAsid());
		UserPO creater = userDao.queryUserByUserId(userId);
		
		if (materialActivityItemPO.getIsStock() == 0) {

			float num = Arith.add(awardStockPO.getNum(), materialActivityItemPO.getNum());

			if (num < 0) {
				throw new FLException(160038, "库存不足!");
			}

			awardStockPO.setNum(Arith.add(awardStockPO.getNum(), materialActivityItemPO.getNum()));

			awardStockDao.update(awardStockPO);

		}
		
		AwardRecordPO awardRecordPO = new AwardRecordPO().init(awardStockPO, creater, AwardRecordPO.TYPE_CG_INT, AwardRecordPO.SUBTYPE_REFUND_INT, AwardRecordPO.ONETYPE_MATERIAL_INT, materialActivityItemPO.getIsStock(), materialActivityItemPO.getMoney(), materialActivityItemPO.getNum(), "");
		awardRecordDao.save(awardRecordPO);
		
		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int expendMaterialActivityItem(MaterialActivityItemVO materialActivityItemVO) throws FLException {

		MaterialActivityItemPO materialActivityItemPO = materialActivityDao.get(materialActivityItemVO.getMaiid());

		if (materialActivityItemPO == null) {
			throw new FLException(140030, "订单活动物品不存在");
		}
		
		if(materialActivityItemPO.getState() != MaterialActivityItemPO.STATUS_RECEIVE_INT){
			throw new FLException(140057, "订单活动奖品不可操作");
		}
		
		materialActivityItemPO.setState(MaterialActivityItemPO.STATUS_CONSUME_INT);
		materialActivityItemPO.setIsStock(MaterialActivityItemPO.STOCK_NC_INT);

		materialActivityDao.update(materialActivityItemPO);
		
		return 0;
	}

}
