package com.fanglin.system.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.system.po.OssConfigPO;

public interface OssConfigDao extends Dao<OssConfigPO> {

	public OssConfigPO querySignature(String accessKeyId, String endpoint, String bucket, String dir);
}
