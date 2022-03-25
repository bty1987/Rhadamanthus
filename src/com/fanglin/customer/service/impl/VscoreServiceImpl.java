package com.fanglin.customer.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.dao.VscoreDao;
import com.fanglin.customer.dao.VscoreRecordDao;
import com.fanglin.customer.po.VscorePO;
import com.fanglin.customer.po.VscoreRecordPO;
import com.fanglin.customer.service.VscoreService;
import com.fanglin.customer.vo.VscoreRecordVO;
import com.fanglin.customer.vo.VscoreVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.utils.Arith;
import com.fanglin.utils.BeanUtil;
import com.fanglin.utils.Paging;

@Service("vscoreService")
@Transactional(readOnly = true)
public class VscoreServiceImpl implements VscoreService {

	@Autowired
	private VscoreDao vscoreDao;

	@Autowired
	private VscoreRecordDao vscoreRecordDao;

	@Autowired
	private UserDao userDao;

	@Override
	public VscoreVO queryVscoreByUnionId(VscoreVO vscoreVO) {

		VscorePO vscorePO = vscoreDao.queryVscoreByUnionId(vscoreVO.getUnionId());

		BeanUtil.copyProperties(vscorePO, vscoreVO);

		return vscoreVO;
	}

	@Override
	public void pageVscoreRecordByUnionId(Paging paging, List<Filter> filters, String unionId) {

		List<VscoreRecordPO> vscoreRecordPOs = vscoreRecordDao.pageVscoreRecordByUnionId(paging, filters, unionId);
		List<VscoreRecordVO> vscoreRecordVOs = new ArrayList<VscoreRecordVO>();

		if (vscoreRecordPOs.size() != 0 && vscoreRecordPOs != null) {

			for (VscoreRecordPO vscoreRecordPO : vscoreRecordPOs) {

				VscoreRecordVO vscoreRecordVO = new VscoreRecordVO(new UserBaseVO());

				BeanUtil.copyProperties(vscoreRecordPO, vscoreRecordVO, Arrays.asList("operater"));
				BeanUtil.copyProperties(vscoreRecordPO.getOperater(), vscoreRecordVO.getOperater(), Arrays.asList("duty", "dept"));

				vscoreRecordVO.setOperateTime(vscoreRecordPO.getOperateTime());

				vscoreRecordVOs.add(vscoreRecordVO);
			}
		}

		paging.setData(vscoreRecordVOs);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void raiseVscore(VscoreVO vscoreVO, String userId) {

		VscorePO vscorePO = vscoreDao.queryVscoreByUnionId(vscoreVO.getUnionId());

		if (vscorePO != null) {

			vscoreRecord(vscorePO.getUnionId(), vscoreVO.getScore(), userDao.queryUserByUserId(userId), VscoreRecordPO.TYPE_ADDED_INT, VscoreRecordPO.STATUS_INITIAL_INT);

		} else {
			VscorePO vscorePOs = new VscorePO();

			BeanUtil.copyProperties(vscoreVO, vscorePOs);
			vscorePOs.setScore(VscorePO.COLUMN_SCORE_INT);

			vscoreDao.save(vscorePOs);

			vscoreRecord(vscorePOs.getUnionId(), vscoreVO.getScore(), userDao.queryUserByUserId(userId), VscoreRecordPO.TYPE_ADDED_INT, VscoreRecordPO.STATUS_INITIAL_INT);
		}
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void pickupVscore(VscoreVO vscoreVO, String userId) throws FLException {

		VscorePO vscorePO = vscoreDao.queryVscoreByUnionId(vscoreVO.getUnionId());

		if (vscorePO == null) {
			throw new FLException(160036, "积分不存在");
		}

		if (vscoreVO.getScore() > vscorePO.getScore()) {
			throw new FLException(160037, "积分不足");
		}

		vscoreRecord(vscorePO.getUnionId(), vscoreVO.getScore(), userDao.queryUserByUserId(userId), VscoreRecordPO.TYPE_EXTRACT_INT, VscoreRecordPO.STATUS_INITIAL_INT);

		vscorePO.setScore(Arith.sub(vscorePO.getScore(), vscoreVO.getScore()));

		vscoreDao.update(vscorePO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void updateVscoreRecordForStatus(VscoreRecordVO vscoreRecordVO) {

		VscoreRecordPO vscoreRecordPO = vscoreRecordDao.get(vscoreRecordVO.getVsrid());

		vscoreRecordPO.setStatus(vscoreRecordVO.getStatus());

		vscoreRecordDao.update(vscoreRecordPO);

		VscorePO vscorePO = vscoreDao.queryVscoreByUnionId(vscoreRecordPO.getUnionId());

		if (vscoreRecordPO.getType() == VscoreRecordPO.TYPE_EXTRACT_INT && vscoreRecordPO.getStatus() == VscoreRecordPO.STATUS_DOWN_INT) {
			vscorePO.setScore(Arith.add(vscorePO.getScore(), vscoreRecordPO.getScore()));
		}

		if (vscoreRecordPO.getType() == VscoreRecordPO.TYPE_ADDED_INT && vscoreRecordPO.getStatus() == VscoreRecordPO.STATUS_PASS_INT) {
			vscorePO.setScore(Arith.add(vscorePO.getScore(), vscoreRecordPO.getScore()));
		}

		vscoreDao.update(vscorePO);
	}

	public void vscoreRecord(String unionId, Integer score, UserPO operater, Short type, Short status) {

		VscoreRecordPO vscoreRecordPO = new VscoreRecordPO();

		vscoreRecordPO.setUnionId(unionId);
		vscoreRecordPO.setScore(score);
		vscoreRecordPO.setOperater(operater);
		vscoreRecordPO.setOperateTime(new Timestamp(System.currentTimeMillis()));
		vscoreRecordPO.setType(type);
		vscoreRecordPO.setStatus(status);

		vscoreRecordDao.save(vscoreRecordPO);
	}

}
