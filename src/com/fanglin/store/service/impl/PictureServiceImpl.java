package com.fanglin.store.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.store.dao.MgoodsDao;
import com.fanglin.store.dao.PictureDao;
import com.fanglin.store.po.MgoodsPO;
import com.fanglin.store.po.PicturePO;
import com.fanglin.store.service.PictureService;
import com.fanglin.store.vo.MbrandVO;
import com.fanglin.store.vo.MgoodsVO;
import com.fanglin.store.vo.PictureVO;
import com.fanglin.utils.BeanUtil;

@Service("pictureService")
@Transactional(readOnly = true)
public class PictureServiceImpl implements PictureService {
	
	@Autowired
	private PictureDao pictureDao;
	
	@Autowired
	private MgoodsDao mgoodsDao;

	@Override
	public List<PictureVO> queryPictureByGid(PictureVO picture) {
		
		List<PicturePO> picturePOs = pictureDao.queryPicture(picture.getMgoods().getGid(), null, PicturePO.STATUS_ABLE_SHORT);
		List<PictureVO> pictureVOs = new ArrayList<PictureVO>();
		
		for (PicturePO picturePO : picturePOs) {
			pictureVOs.add(picturePOToVO(picturePO));
		}
		
		return pictureVOs;
		
	}
	
	@Override
	public List<PictureVO> queryPictureByType(PictureVO picture) {
		
		List<PicturePO> picturePOs = pictureDao.queryPicture(picture.getMgoods().getGid(), picture.getType(), PicturePO.STATUS_ABLE_SHORT);
		List<PictureVO> pictureVOs = new ArrayList<PictureVO>();
		
		for (PicturePO picturePO : picturePOs) {
			pictureVOs.add(picturePOToVO(picturePO));
		}
		
		return pictureVOs;
		
	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public List<PictureVO> addPicture(PictureVO picture, List<String> picturnUrls) {
		
		List<PictureVO> pictureVOs = new ArrayList<PictureVO>();
		
		MgoodsPO mgoodsPO = mgoodsDao.get(picture.getMgoods().getGid());
		
		for (String picturnUrl : picturnUrls) {
			
			List<PicturePO> picturePOs = pictureDao.queryPicture(picture.getMgoods().getGid(), picture.getType(), null);
			
			PicturePO picturePO = new PicturePO(mgoodsPO);
			
			BeanUtil.copyProperties(picture, picturePO, Arrays.asList("mgoods", "img", "sort"));
			
			if(picturePOs != null && picturePOs.size() > 0){
				
				int length = picturePOs.size();
				
				Short newSort = picturePOs.get(length-1).getSort();
				
				picturePO.setSort((short) (newSort+1));
				
			}else{
				
				picturePO.setSort((short) 1);
				
			}
			
			picturePO.setImg(picturnUrl);
			
			pictureDao.save(picturePO);
			
			PictureVO pictureVO = new PictureVO(new MgoodsVO());
			
			BeanUtil.copyProperties(picturePO, pictureVO, Arrays.asList("mgoods"));
			BeanUtil.copyProperties(picturePO.getMgoods(), pictureVO.getMgoods(), Arrays.asList("mbrand"));
			
			pictureVOs.add(pictureVO);
			
		}
		
		return pictureVOs;
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updatePicture(PictureVO picture) throws FLException {
		
		PicturePO picturePO = pictureDao.get(picture.getPid());
		
		if(picturePO == null){
			throw new FLException(111111, "图片不存在");
		}
		
		BeanUtil.copyProperties(picture, picturePO, Arrays.asList("mgoods", "status"));
		
		if(picture.getMgoods() != null){
			
			MgoodsPO mgoodsPO = mgoodsDao.get(picture.getMgoods().getGid());
			
			picturePO.setMgoods(mgoodsPO);
			
		}
		
		pictureDao.update(picturePO);

	}
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updatePictureForSort(List<PictureVO> pictures) {
		
		List<Long> pids = new ArrayList<Long>();
		List<Short> nums = new ArrayList<Short>();
		
		for (PictureVO pictureVO : pictures) {
			PicturePO picturePO = pictureDao.get(pictureVO.getPid());
			pids.add(picturePO.getPid());
			nums.add(picturePO.getSort());
		}
		
		pictureDao.updatePictureForSort(pids.get(0), nums.get(1));
		pictureDao.updatePictureForSort(pids.get(1), nums.get(0));
		
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deletePicture(PictureVO picture) throws FLException {
		
		PicturePO picturePO = pictureDao.get(picture.getPid());
		
		if(picturePO == null){
			throw new FLException(111111, "图片不存在");
		}
		
		picturePO.setStatus(PicturePO.STATUS_DISABLE_SHORT);
		
		pictureDao.update(picturePO);

	}
	
	public PictureVO picturePOToVO(PicturePO picturePO){
		
		PictureVO pictureVO = new PictureVO(new MgoodsVO(new MbrandVO()));
		
		BeanUtil.copyProperties(picturePO, pictureVO, Arrays.asList("mgoods"));
		
		BeanUtil.copyProperties(picturePO.getMgoods(), pictureVO.getMgoods(), Arrays.asList("mbrand"));
		
		BeanUtil.copyProperties(picturePO.getMgoods().getMbrand(), pictureVO.getMgoods().getMbrand(), Arrays.asList("mcategory"));
		
		return pictureVO;
		
	}

}
