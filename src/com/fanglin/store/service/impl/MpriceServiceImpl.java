package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.McolorDao;
import com.fanglin.store.dao.MformatDao;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.dao.MpriceDao;
import com.fanglin.store.po.McolorPO;
import com.fanglin.store.po.MformatPO;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.po.MpricePO;
import com.fanglin.store.service.MpriceService;
import com.fanglin.store.vo.McolorVO;
import com.fanglin.store.vo.MformatVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.MpriceVO;
import com.fanglin.utils.BeanUtil;

@Service("mpriceService")
@Transactional(readOnly = true)
public class MpriceServiceImpl implements MpriceService {

	@Autowired
	private MpriceDao mpriceDao;

	@Autowired
	private MgoodsDao mgoodsDao;

	@Autowired
	private McolorDao mcolorDao;

	@Autowired
	private MformatDao mformatDao;

	@Override
	public List<MpriceVO> queryMprice(MpriceVO mpriceVO) {

		List<MpricePO> mpricePOs = mpriceDao.queryMprice(mpriceVO.getMgoods().getGid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();

		for (MpricePO mpricePO : mpricePOs) {
			mpriceVOs.add(mpricePOToVO(mpricePO));
		}

		return mpriceVOs;
	}

	@Override
	public List<MpriceVO> queryMpriceByGid(MpriceVO mpriceVO) {

		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByGid(mpriceVO.getMgoods().getGid());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();

		for (MpricePO mpricePO : mpricePOs) {
			mpriceVOs.add(mpricePOToVO(mpricePO));
		}

		return mpriceVOs;
	}

	@Override
	public List<MpriceVO> queryMpriceByPinyin(MpriceVO mpriceVO) {

		List<MpricePO> mpricePOs = mpriceDao.queryMpriceByPinyin(mpriceVO.getMgoods().getPinyin());
		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();

		for (MpricePO mpricePO : mpricePOs) {
			mpriceVOs.add(mpricePOToVO(mpricePO));
		}

		return mpriceVOs;
	}

	@Override
	public List<MpriceVO> queryMpriceForShow(MpriceVO mpriceVO) {

		List<MpriceVO> mpriceVOs = new ArrayList<MpriceVO>();

		if (mpriceVO.getStatus() == 2 || mpriceVO.getStatus() == 3) {

			List<MpricePO> mpricePOs = mpriceDao.queryMpriceForShow(mpriceVO.getStatus());

			for (MpricePO mpricePO : mpricePOs) {
				mpriceVOs.add(mpricePOToVO(mpricePO));
			}
		}

		return mpriceVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addMprice(MpriceVO mpriceVO) throws FLException {

		Long gid = mpriceVO.getMgoods().getGid();
		Long cid = mpriceVO.getMcolor().getCid();
		Long fid = mpriceVO.getMformat().getFid();

		int count = mpriceDao.count(gid, cid, fid);

		if (count > 0) {
			throw new FLException(340014, "商品-颜色-规格对应价格已存在");
		}

		MgoodsPO mgoodsPO = mgoodsDao.get(gid);
		McolorPO mcolorPO = mcolorDao.get(cid);
		MformatPO mformatPO = mformatDao.get(fid);

		MpricePO mpricePO = new MpricePO(mgoodsPO, mcolorPO, mformatPO);

		BeanUtil.copyProperties(mpriceVO, mpricePO, Arrays.asList("mgoods", "mcolor", "mformat"));
		mpricePO.setStatus(MpricePO.STATUS_ENABLE_INT);

		mpriceDao.save(mpricePO);

		return 0;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateMpriceForStatus(MpriceVO mpriceVO) {

		MpricePO mpricePO = mpriceDao.get(mpriceVO.getPid());

		mpricePO.setStatus(mpriceVO.getStatus());

		mpriceDao.update(mpricePO);

		return 0;
	}

	public MpriceVO mpricePOToVO(MpricePO mpricePO) {

		MpriceVO mpriceVO = new MpriceVO(new MgoodsVO(), new McolorVO(), new MformatVO());

		BeanUtil.copyProperties(mpricePO, mpriceVO, Arrays.asList("mgoods", "mcolor", "mformat"));
		BeanUtil.copyProperties(mpricePO.getMgoods(), mpriceVO.getMgoods(), Arrays.asList("mbrand"));
		BeanUtil.copyProperties(mpricePO.getMcolor(), mpriceVO.getMcolor());
		BeanUtil.copyProperties(mpricePO.getMformat(), mpriceVO.getMformat());

		return mpriceVO;
	}
}
