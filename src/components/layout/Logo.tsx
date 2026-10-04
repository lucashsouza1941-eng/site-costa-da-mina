import Image from 'next/image';
import Link from 'next/link';
import { imagem } from '@/content/acervo';
import { cx } from '@/lib/cx';

type Props = {
  /** "branco" para fundos escuros (rodapé, menu do celular) */
  tom?: 'cor' | 'branco';
  className?: string;
  prioridade?: boolean;
};

/** Logotipo oficial, sempre como link para o início. */
export function Logo({ tom = 'cor', className, prioridade }: Props) {
  const logo = imagem(tom === 'branco' ? 'logo-horizontal-branco' : 'logo-horizontal');
  return (
    <Link href="/" className={cx('inline-block shrink-0 rounded-card', className)} aria-label="Instituto Costa da Mina, página inicial">
      <Image
        src={logo.src}
        alt=""
        width={logo.largura}
        height={logo.altura}
        sizes="192px"
        loading={prioridade ? 'eager' : 'lazy'}
        className="h-full w-auto"
      />
    </Link>
  );
}
