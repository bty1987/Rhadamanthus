package com.fanglin.sales.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.po.UserPO;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.sales.dao.OalesRecordDao;
import com.fanglin.sales.po.OalesRecordPO;
import com.fanglin.sales.service.OalesRecordService;
import com.fanglin.sales.vo.OalesRecordVO;
import com.fanglin.utils.Paging;

/**
 * 外销单操作记录Service实现
 *
 * @author AI Assistant
 * @date 2026-03-17
 */
@Service("oalesRecordService")
@Transactional(readOnly = true)
public class OalesRecordServiceImpl implements OalesRecordService {

	@Autowired
	private OalesRecordDao oalesRecordDao;

	@Autowired
	private UserDao userDao;

	@Override
	public void pageOalesRecord(Paging paging, List<Filter> filters, Long oid) throws FLException {
		List<OalesRecordPO> oalesRecordPOs = oalesRecordDao.pageOalesRecord(paging, filters, oid);
		List<OalesRecordVO> oalesRecordVOs = new ArrayList<OalesRecordVO>();

		for (OalesRecordPO oalesRecordPO : oalesRecordPOs) {
			OalesRecordVO oalesRecordVO = oalesRecordPO.ptv(new OalesRecordVO(null, null, new UserBaseVO()));
			oalesRecordVOs.add(oalesRecordVO);
		}

		paging.setData(oalesRecordVOs);
	}

	@Override
	public List<OalesRecordVO> queryOalesRecordByOid(long oid) throws FLException {
		List<OalesRecordPO> oalesRecordPOs = oalesRecordDao.queryOalesRecordByOid(oid);
		List<OalesRecordVO> oalesRecordVOs = new ArrayList<OalesRecordVO>();

		for (OalesRecordPO oalesRecordPO : oalesRecordPOs) {
			OalesRecordVO oalesRecordVO = oalesRecordPO.ptv(new OalesRecordVO(null, null, new UserBaseVO()));
			oalesRecordVOs.add(oalesRecordVO);
		}

		return oalesRecordVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOalesRecord(long oid, short type, String userId, String comment) throws FLException {
		UserPO operater = userDao.queryUserByUserId(userId);
		OalesRecordPO oalesRecordPO = new OalesRecordPO();
		oalesRecordPO.init(oid, type, operater, comment);
		oalesRecordDao.save(oalesRecordPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOalesRecord(long oid, short type, String userId, String comment, Short beforeStatus, Short afterStatus) throws FLException {
		UserPO operater = userDao.queryUserByUserId(userId);
		OalesRecordPO oalesRecordPO = new OalesRecordPO();
		oalesRecordPO.init(oid, type, operater, comment, beforeStatus, afterStatus);
		oalesRecordDao.save(oalesRecordPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOalesPayRecord(long oid, long opid, short type, String userId, String comment) throws FLException {
		UserPO operater = userDao.queryUserByUserId(userId);
		OalesRecordPO oalesRecordPO = new OalesRecordPO();
		oalesRecordPO.init(oid, opid, type, operater, comment);
		oalesRecordDao.save(oalesRecordPO);
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void addOalesRecordBatch(long oid, short type, String userId, String comment) throws FLException {
		// 批量添加时可以一次性创建多条记录
		// 这里暂时和单条记录一样处理，如有需要可以扩展
		addOalesRecord(oid, type, userId, comment);
	}
}
