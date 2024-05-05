package com.fanglin.communion.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.communion.dao.AssistanceItemDao;
import com.fanglin.communion.po.AssistanceItemPO;
import com.fanglin.communion.service.AssistanceItemService;
import com.fanglin.communion.service.DataDrawingService;
import com.fanglin.communion.vo.AssistanceItemVO;
import com.fanglin.communion.vo.AssistanceVO;
import com.fanglin.communion.vo.DataDrawingVO;
import com.fanglin.utils.BeanUtil;

@Service("assistanceItemService")
@Transactional(readOnly = true)
public class AssistanceItemServiceImpl implements AssistanceItemService {

	@Autowired
	private AssistanceItemDao assistanceItemDao;

	// @Autowired
	// private DataDrawingDao dataDrawingDao;

	@Autowired
	private DataDrawingService dataDrawingService;

	//
	// @Autowired
	// private AssistanceDao assistanceDao;

	@Override
	public List<AssistanceItemVO> queryAssistanceItem(AssistanceVO assistanceVO) {

		List<AssistanceItemPO> assistanceItemPOs = assistanceItemDao.queryAssistanceItem(assistanceVO.getAid());
		List<AssistanceItemVO> assistanceItemVOs = new ArrayList<AssistanceItemVO>();

		for (AssistanceItemPO assistanceItemPO : assistanceItemPOs) {

			AssistanceItemVO assistanceItemVO = new AssistanceItemVO(new ArrayList<DataDrawingVO>());

			BeanUtil.copyProperties(assistanceItemPO, assistanceItemVO, Arrays.asList("drawings"));
			List<DataDrawingVO> dataDrawingVOs = new ArrayList<DataDrawingVO>();

			DataDrawingVO dataDrawingVO = new DataDrawingVO();
			dataDrawingVO.setSid(assistanceItemPO.getAiid());
			dataDrawingVO.setType(AssistanceItemPO.TYPE_HELP_INT);
			dataDrawingVOs = dataDrawingService.queryDataDrawing(dataDrawingVO);

			assistanceItemVO.getDrawings().addAll(dataDrawingVOs);
			assistanceItemVOs.add(assistanceItemVO);
		}

		return assistanceItemVOs;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int addAssistanceItem(AssistanceVO assistanceVO, AssistanceItemVO assistanceItemVO) {

		AssistanceItemPO assistanceItemPO = new AssistanceItemPO();

		BeanUtil.copyProperties(assistanceItemVO, assistanceItemPO);

		assistanceItemPO.setAid(assistanceVO.getAid());

		assistanceItemDao.save(assistanceItemPO);

		return 0;

	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateAssistanceItem(AssistanceVO assistanceVO, AssistanceItemVO assistanceItemVO) {

		AssistanceItemPO assistanceItemPO = assistanceItemDao.get(assistanceItemVO.getAiid());

		BeanUtil.copyProperties(assistanceItemVO, assistanceItemPO);

		assistanceItemDao.update(assistanceItemPO);

		return 0;

	}
}
