package com.fanglin.store.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.store.po.PicturePO;

public interface PictureDao extends Dao<PicturePO> {

	public List<PicturePO> queryPictureByGid(Long gid);

	public List<PicturePO> queryPicture(Long gid, Short type);

	public int updatePictureForSort(Long pid, Short sort);

}
