package com.fanglin.communion.service.impl;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fanglin.communion.dao.DataDrawingDao;
import com.fanglin.communion.po.DataDrawingPO;
import com.fanglin.communion.service.DataDrawingService;
import com.fanglin.communion.vo.DataDrawingVO;
import com.fanglin.personel.dao.UserDao;
import com.fanglin.personel.vo.UserVO;
import com.fanglin.utils.BeanUtil;

@Service("dataDrawingService")
@Transactional(readOnly = true)
public class DataDrawingServiceImpl implements DataDrawingService {

	@Autowired
	private DataDrawingDao dataDrawingDao;

	@Autowired
	private UserDao userDao;

	@Override
	public List<DataDrawingVO> queryDataDrawing(DataDrawingVO dataDrawingVO) {

		List<DataDrawingPO> dataDrawingPOs = dataDrawingDao.queryDataDrawing(dataDrawingVO.getSid(), dataDrawingVO.getType());
		List<DataDrawingVO> dataDrawingVOs = new ArrayList<DataDrawingVO>();

		for (DataDrawingPO dataDrawingPO : dataDrawingPOs) {

			DataDrawingVO dataDrawing = new DataDrawingVO(new UserVO());

			BeanUtil.copyProperties(dataDrawingPO, dataDrawing, Arrays.asList("creater"));

			BeanUtil.copyProperties(dataDrawingPO.getCreater(), dataDrawing.getCreater(), Arrays.asList("role", "dept", "duty"));

			dataDrawingVOs.add(dataDrawing);
		}

		return dataDrawingVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	@SuppressWarnings("deprecation")
	public void addDataDrawing(DataDrawingVO dataDrawingVO, String userId) {

		DataDrawingPO dataDrawingPO = new DataDrawingPO();

		BeanUtil.copyProperties(dataDrawingVO, dataDrawingPO, Arrays.asList("creater", "createTime"));

		dataDrawingPO.setCreater(userDao.queryUserByUserId(userId));

		Timestamp createTime = new Timestamp(System.currentTimeMillis());
		
		createTime.setHours(Integer.valueOf(String.valueOf(createTime).substring(11, 13)) + 8);
		
		dataDrawingPO.setCreateTime(createTime);

		dataDrawingPO.setStatus(DataDrawingPO.STATUS_INIT_INT);

		dataDrawingDao.save(dataDrawingPO);

		BeanUtil.copyProperties(dataDrawingPO, dataDrawingVO, Arrays.asList("creater"));

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void deleteDataDrawing(DataDrawingVO dataDrawingVO) {

		DataDrawingPO dataDrawingPO = dataDrawingDao.get(dataDrawingVO.getDdid());

		dataDrawingPO.setStatus(DataDrawingPO.STATUS_DISABLE_INT);

		dataDrawingDao.update(dataDrawingPO);

	}

}
