/**
 * @File Name		: Test.java
 * @Package   	: com.fanglin.swiftpass.airpos
 * @Version		: 1.0
 * @Date			: 2023-6-14
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.swiftpass.airpos;

import java.util.TreeMap;

import cn.hutool.crypto.SmUtil;
import cn.hutool.crypto.asymmetric.KeyType;

import com.fanglin.swiftpass.enums.ReqMethodEnum;
import com.fanglin.swiftpass.utils.OpenSdk;

public class Test {

	public static void main(String[] args) {

		TreeMap<String, String> params = new TreeMap<String, String>();

		params.put("mchNo", "shenyang-fljjzs"); // 商户号
		params.put("channelType", "SWIFT_PASS"); // 渠道类型
		params.put("signType", "RSA_1_256"); // 签名类型
		String prikey = SmUtil
				.sm2(null, "MFkwEwYHKoZIzj0CAQYIKoEcz1UBgi0DQgAEPAQf2sOkhxeCxKR2A3O0pN1AXy8N3GUraKL61FkegTPPIS0g02TcbSVPOg7JDuL8KDDMLi54PAmNes7LidqlAA==")
				.encryptHex(
						"MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCqUBd4IPbLhB2eGeVTl3RnAKQF3QnNSgXdapAdl9cQet0yariQXgmoDhWQerPiYFyJfX1j5yoKgaY47OGz1nSmtfLcgcrUodohpgU4+uuYGjtKkLPl5FTShegmEjeZRCKCEIJqGBcW35mUIYnYagaocfiBoVkYgYzmuNvBp2+NuZdCDjFYum4lgwlEkwNT3zhORFBP2WJZvEVAyYZVmb4BMQCo2IUR1GAd0s7FnrEvQaqKGNgVlAMb1JQp0oz/GBR620my+umIcef0LOj8ijV9w0/EO9xIsDnbMJy60Ypb07m1wb3hiYkL5/hOt1fAfKYEJ1YgXRGGISRzIBeglHHbAgMBAAECggEBAIR0X5xMvsOOz137M9AsFRpadDYfLxVagW8vBkANq/QkKc2hFEMq74Wk1n6T/zyKxs0jLJa63IZpSHYzPGGZ4wUYsnVt9+ogqj3LGXq0IvAbTotyOIcNai6EeATL3DO1usS+xD5w19wxMAb1gnguFVmBscxXSKx3bLavhDF635YvO6uTg+kpCKdyR8GrLzxnv4wMm5tqkH/Ca+gU0g7fY98BNG7DtSytydGNTDf/48TxbNenay/eGgES2zKV6O18velv7rx+QW6/a5xcUSS3rHEs87hreByiVEKz9ZBHzlY6gNI7ebtgJzSRSxo2Kkk6SMQGZuJTne9LTAJJpACMzHECgYEA+RCg3pfSKvKK6C3ELyZJEefv9c3KinEiqLJJTWH/azuEDDixxVvSZ2y0dAs/PBGSjJ9QZbP5aG7oS1NvyZYNlGAtKtK1dwDW/U8tCNEhif+gXaX+NWwsmn5jq7ddPEeqGsBSgyj4La8x4HFTnxcFjzgKEBPbrwadto0GFz1epbkCgYEArw4bVLWAR37/Ys+U9Uyv2efWiaFp4SnqRarHoksa+ZzpS32yX8a1Tt51Ic9Krg29u9/Xotk3lo5XOHs/w0mrz6rTh0zQ6C41IWw6jtKHXhq0uA8v3KdP2XWfFpeCrT96k3Alisck5k95XarOEtyp0ByjBcPioI78r1IyLdyb3jMCgYEAoHC2wE0ahLHzCzeYHitSfKdlK3lilKXmhrc6gw+ywnf3SwwmcBUDR759zBcGqAJF3jIuTyWNb1mqaAOaikgP/VmrHt/XJ46x70FWqExXh5bUzh7Ez9McNHVgbVhURiWADXWAcZ8tp/gocAVwsZXZ7fVSfiLcrDXd2J+locjVtHkCgYAWGRDIK7VK0TRJ8+xY3tpgBo0liJPGEbV6H+ndid+Y3P7yQabPwlTG5PwiTXme6SsnWUVuUD9dKRDHl39gFp+yslzLep3wgUzBsFjgCKF/9p0Tkw82qoRA7kEr5+peFmJR1FlY4HS/Ag9PDK3A4cwp8kN+CdFE9WfedeDRu0SN0wKBgQDgsBzhDvdv86lksO62NbW7KcBD6BbMq7BJJIHRhnJo51Fn+uMv5ZhqIb/6Qn+h+NH7y1i3ylw4e/TPrIU9gO30IwErDAjMDxOYYk49Cu3RCc58XZ6j0RO0nbhBfyPiW0JF/PNh5OnfGu3e/s8zRlVec6Fsbxd8kUvq+/pKyvLQJA==",
						KeyType.PublicKey); // 收银台公钥+商户私钥
		params.put("privateKey", prikey); // 签名私钥
		params.put("publicKey", "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnmpxXjTJVhVXr2rPs9uBfWhAH9cLhBT+KJ5UiLUd0uxrPVec8WCQyZPQnnL0JOgQSBr0rWLcGVxGAdQUt748DfDGn6G/fhdFGJaHwCRfqxM7ymJ/xPm3UQNJeCF1qjDffdRilYwP4FSyiI+T8eAIeSABUTBDx7kkwvkbVi14znZMmDpLx6QNZlAclAZdHemqB/sSSsgfB7yCBJ4K0Fv4uK4qU3EQeOxhXLkitkhPm3uL5O3jgf89B1ZFpiCpI5qyysmPzJuZbvIBfa9OkVeHqINTPCWYCdx3ZD+k9+H5hoXKFDXddvxHptXrPU3APiBcDkgViYbfnFxWjYwaDQDkYQIDAQAB"); // 平台公钥

		String response = OpenSdk.gateway("/api/openbill/updateMerchantChannelKey", ReqMethodEnum.POST, null, null, params);

		System.out.println(response);

	}

}
